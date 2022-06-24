const core = require('@actions/core');
const axios = require('axios');
const github = require('@actions/github');

const { chunk } = require('./utils');
const { createSearchConfig, createEventPostConfig } = require('./newrelic');


const main = async () => {

    console.log(createSearchConfig({application_name:"Devops",api_key:"ApiKey"}));
    console.log(createEventPostConfig({
        account_id:"1234457",
        insights_insert_key:"EspecialKey",
        param1:"a",
        param2:"b"
    }))

}


try {
    main();
} catch (error) {

}