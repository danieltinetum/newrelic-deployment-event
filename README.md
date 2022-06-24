# Deployment Register javascript action

This action records the time elapsed from the push on the branch until the deployment is completed.

## Inputs

## `account-id`

**Required** From one.newrelic.com, use the account selector dropdown near the top of the page to switch between accounts and see their IDs.

## `insights-insert-key`
**Required** One of our older New Relic API keys used for data ingest is the Insights insert key, also known as an insert key. Note that the license key is used for the same functionality and more, which is why we recommend the license key over this key. [https://one.newrelic.com/launcher/api-keys-ui.api-keys-launcher]

## `api-key`
**Required** New Relic's REST API makes it easy to connect your monitoring data and configurations to your code, your systems, and your business. [https://rpm.newrelic.com/api/explore]

## `application-name`
**Required** Name of the application as it is known in the organization, do not use the repository name.


## Outputs

## `time`

The elapsed time from push to deployment.

## Example usage

on: [push]

jobs:
  deployment_registry:
    runs-on: ubuntu-20.04
    name: Record frequency deployment && lead time
    steps:
      - name: Record frequency && Mean lead time
        id: deployment_event
        uses: danieltinetum/newrelic-deployment-event@v1.1
        with:
          account-id: ''
          nsights-insert-key: ''
          api-key: ''
          application-name: 'sb'
          debbug: 'true'
      - name: Get the output time
        run: echo "The time was ${{ steps.deployment_event.outputs.time }}"