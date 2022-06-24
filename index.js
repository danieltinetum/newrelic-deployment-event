const core = require('@actions/core');
const github = require('@actions/github');


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

    console.log(base)
    console.log(search)


}


main();