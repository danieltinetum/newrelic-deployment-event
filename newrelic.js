
const createSearchConfig = ({application_name, api_key}) => {
    return {
        method: 'get',
        url: `https://api.newrelic.com/v2/applications.json?filter[name]=${application_name}')}`,
        headers: {
            'X-Api-Key': api_key
        }
    };
}

const createEventPostConfig = ({account_id, insights_insert_key, ...params}) => {
    return {
        method: 'post',
        url: `https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`,
        headers: {
            'X-Insert-Key': insights_insert_key,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            params
        })
    }
}

module.export = {
    createSearchConfig
}