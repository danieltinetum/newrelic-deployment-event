const core = require('@actions/core');
const axios = require('axios');
const github = require('@actions/github');

const { chunk } = require('./utils');
const { createSearchConfig, createEventPostConfig } = require('./newrelic');


const main = async () => {
    const PARTITION_SIZE = 2
    const PRD_BRANCHES = [
        'main',
        'master'
    ];

    const deployed_at = new Date().getTime();

    const { payload, ...context } = github.context;
    const branch = context.ref.substring(context.ref.lastIndexOf('/') + 1, context.ref.length);
    const remove_pull = payload.commits.filter(c => c.message.indexOf('pull request') === -1);

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
        console.log(commits.length, "/", payload.commits.length);
    }

}


try {
    main();
} catch (error) {

}