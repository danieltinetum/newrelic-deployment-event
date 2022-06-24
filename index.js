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

    
    const { data } = await axios(createSearchConfig({
        api_key: core.getInput('api-key'),
        application_name: core.getInput('application-name')
    }));

    console.log(data)

}


try {
    main();
} catch (error) {

}