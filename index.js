const core = require('@actions/core');
const axios = require('axios');
const github = require('@actions/github');

const { chunk } = require('./utils');
const { createSearchConfig, 
        createEventPostConfig } = require('./newrelic');


const main = async () => {
    const PARTITION_SIZE = 2
    const PRD_BRANCHES = [
        'main',
        'master'
    ];
    const errors = [];
    const successful = [];

    const deployed_at = new Date().getTime();

    const { payload, ...context } = github.context;
    const branch = context.ref.substring(context.ref.lastIndexOf('/') + 1, context.ref.length);
    const remove_pull = payload.commits.filter(c => c.message.indexOf('pull request') === -1);

    if (remove_pull.length === 0){
        core.warning('There are no commits that comply with the evaluation.')
        return;
    }

    const { data } = await axios(createSearchConfig({
        api_key: core.getInput('api-key'),
        application_name: core.getInput('application-name')
    }));

    if (data.applications.length > 1) {
        core.setFailed(`The application search returned more than one result, please be more specific or type the full application name.`);
        process.exit(1);
        return;
    }

    const { id, name } = data.applications.shift();

    for (const commits of chunk(remove_pull, PARTITION_SIZE)) {
        const requests = commits.map(commit =>
            axios(createEventPostConfig({
                "account_id": core.getInput('account-id'),
                "insights_insert_key": core.getInput('insights-insert-key'),
                "eventType": "BelDeployment",
                "appId": id,
                "appName": name,
                "revision": context.runId,
                "environment": PRD_BRANCHES.includes(branch) ? "PRD" : "QA",
                "type": "regular",
                "jobName": context.job,
                "buildNumber": context.runNumber,
                "branchName": branch,
                "commit": commit.id,
                "codeCommittedTime": new Date(commit.timestamp).getTime(),
                "codeDeployedTime": deployed_at,
                "buildStatus": "SUCESSFULL",
                "sendFrom": "GithubActions"
            }))
        );

        try {
            const response = await Promise.all(requests);
            core.info(`Result: ${JSON.stringify(response)}`);
            successful.push(requests.length);
        } catch (error) {
            errors.push(requests.length);
        }
    }

    core.setOutput("successful", successful.reduce((a, b) => a + b, 0));
    core.setOutput("errors", errors.reduce((a, b) => a + b, 0));

    if (errors.length === configs.length) {
        core.setFailed(`All requests to New Relic were unsuccessful - (${errors.length})`);
        process.exit(1);
    } else if (errors.length > 0) {
        core.setFailed(`Some requests to New Relic were unsuccessful - ${errors.length} / ${configs.length}`);
        process.exit(1);
    }

}


try {
    main();
} catch (error) {
    core.setFailed(error.message);
    process.exit(1);
}