/* global process, console */
/* eslint-disable no-console */

import program from 'commander';
import requestPromise from 'request-promise';
import { resolve as resolveURL } from 'url';
import { assign } from 'lodash';

const request = requestPromise.defaults({
    jar: true,
    json: true
});

const CAMPAIGN_QUERY = {
    application: 'showcase',
    statuses: [
        'draft', 'new', 'pending', 'approved', 'rejected', 'active', 'paused', 'inactive',
        'expired', 'outOfBudget', 'error'
    ].join(',')
};

program
    .option('--rc.email <email>', 'RC user email')
    .option('--rc.password <password>', 'RC user password')
    .option(
        '--rc.api-root [apiRoot]',
        'RC API environment.',
        'https://platform-staging.reelcontent.com/'
    )

    .option(
        '--org [orgID]',
        'Optional org id to set targets on.',
        null
    )

    .parse(process.argv);

Promise.resolve().then(() => {
    const { org } = program;
    const api = (url => resolveURL(program['rc.apiRoot'], `/api/${url}`));

    return request.post(api('auth/login'), {
        json: {
            email: program['rc.email'],
            password: program['rc.password']
        }
    }).then(() => (
        request.get(api('campaigns'), {
            qs: org ? assign({}, CAMPAIGN_QUERY, { org }) : CAMPAIGN_QUERY
        })
    )).then(campaigns => Promise.all(campaigns.map(campaign => {
        if (campaign.targetUsers) {
            return console.info(
                `campaign(${campaign.id}) already has targetUsers: ${campaign.targetUsers}.`
            );
        }

        return request.get(api('transactions/showcase/current-payment'), {
            qs: { org: campaign.org }
        }).then(cycle => (
            request.put(api(`campaigns/${campaign.id}`), {
                body: {
                    targetUsers: cycle.totalViews
                }
            }).then(campaign => console.info(
                `Updated campaign(${campaign.id}) targetUsers: ${campaign.targetUsers}.`
            ))
        ), error => console.warn(
            `Couldn't get current payment for campaign(${campaign.id})/org(${campaign.org}):` +
            ` ${error.message}`
        ));
    })));
}).catch(reason => process.nextTick(() => {
    throw reason;
}));
