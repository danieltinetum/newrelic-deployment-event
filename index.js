const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')

const main = async () => {

    const deployed_at = new Date().getTime();
    const { payload, ...context } = github.context;
    const branch = context.ref.substring(context.ref.lastIndexOf('/') + 1, context.ref.length);

    const configs = [];
    const successful = [];
    const errors = [];

    const base = {
        method: 'post',
        url: `https://insights-collector.newrelic.com/v1/accounts/${core.getInput('account-id')}/events`,
        headers: {
            'X-Insert-Key': core.getInput('insights-insert-key'),
            'Content-Type': 'application/json'
        },
        data: ""
    };

    const search = {
        method: 'get',
        url: `https://api.newrelic.com/v2/applications.json?filter[name]=${core.getInput('application-name')}`,
        headers: {
            'X-Api-Key': core.getInput('api-key')
        }
    };

    
    const { data } = await axios(search)
    
    if (data.applications.length > 1) {
        core.setFailed(`The application search returned more than one result, please be more specific or type the full application name.`);
        process.exit(1);
        return;
    }

    const application_id = data.applications[0].id;
    const nr_app_name = data.applications[0].name;

    payload.commits.forEach(commit => {
        const conf = JSON.parse(JSON.stringify(base))
        conf.data = JSON.stringify({
            "eventType": "BelDeployment",
            "appId": application_id,
            "appName": nr_app_name,
            "revision": context.runId,
            "environment": ['main', 'master'].includes(branch) ? "PRD" : "QA",
            "type": "regular",
            "jobName": context.job,
            "buildNumber": context.runNumber,
            "branchName": branch,
            "commit": commit.id,
            "codeCommittedTime": new Date(commit.timestamp).getTime(),
            "codeDeployedTime": deployed_at,
            "buildStatus": "SUCESSFULL",
            "sendFrom": "GithubActions"
        });
        configs.push(
            conf
        );
    })

    for (const item of configs) {
        try {
            const result = await axios(item)
            successful.push(result.data ? 1 : 0)
        } catch (error) {
            errors.push(1)
        }
    }

    core.setOutput("successful", successful.reduce((a, b) => a + b, 0));
    core.setOutput("errors", errors.reduce((a, b) => a + b, 0));

    if (errors.length === configs.length) {
        core.setFailed(`All requests to New Relic were unsuccessful - (${errors.length})`);
        process.exit(1);
    }else if (errors.length > 0){
        core.setFailed(`Some requests to New Relic were unsuccessful - ${errors.length} / ${configs.length}`);
        process.exit(1);
    }

}


main();