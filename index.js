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

    
    const { data } = await axios(search)
    
    if (data.applications.length > 1) {
        core.setFailed(`The application search returned more than one result, please be more specific or type the full application name.`);
        process.exit(1);
        return;
    }

    const application_id = data.applications[0].id;
    const nr_app_name = data.applications[0].name;

    console.log( application_id, nr_app_name )

}


main();