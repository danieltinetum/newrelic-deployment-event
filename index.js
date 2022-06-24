const core = require('@actions/core');
const axios = require('axios');
const github = require('@actions/github');

const { chunk } = require('./utils');
const { createSearchConfig, createEventPostConfig } = require('./newrelic');


const main = async () => {

    console.log(github.context)

}


try {
    main();
} catch (error) {
    core.setFailed(error.message);
    process.exit(1);
}