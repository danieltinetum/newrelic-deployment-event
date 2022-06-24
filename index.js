const core = require('@actions/core');
const axios = require('axios');
const github = require('@actions/github');

const { chunk } = require('./utils');
const { createSearchConfig, createEventPostConfig } = require('./newrelic');


const main = async () => {
    const PARTITION_SIZE = 2

    console.log(createSearchConfig({application_name:"Devops",api_key:"ApiKey"}));
    console.log(createEventPostConfig({
        account_id:"1234457",
        insights_insert_key:"EspecialKey",
        param1:"a",
        param2:"b"
    }))
    
    const commits = ["A","B","C","D","E","F","G"];

    console.log(chunk(
        commits, 
        PARTITION_SIZE
    ));
}


try {
    main();
} catch (error) {

}