/* global process */

import program from 'commander';
import requestPromise from 'request-promise';
import { resolve as resolveURL } from 'url';
import { assign, get } from 'lodash';
import BeeswaxClient from 'beeswax-client';
import { JsonProducer } from 'rc-kinesis';

const request = requestPromise.defaults({
    jar: true,
    json: true
});

program
    .arguments('<campaign>', 'Campaign ID')

    .option('--rc.email <email>', 'RC user email')
    .option('--rc.password <password>', 'RC user password')
    .option(
        '--rc.api-root [apiRoot]',
        'RC API environment.',
        'https://platform-staging.reelcontent.com/'
    )

    .option('--beeswax.email <email>', 'Beeswax user email')
    .option('--beeswax.password <password>', 'Beeswax user password')
    .option(
        '--beeswax.api-root [apiRoot]',
        'Beeswax API environment',
        'https://stingersbx.api.beeswax.com'
    )

    .option('--no-produce', 'Skip producing a record to the cwrx stream')

    .option('--kinesis.region [region]', 'AWS region for Kinesis', 'us-east-1')
    .option('--kinesis.stream [stream]', 'Kinesis stream name', 'stagingCwrxStream')

    .action(campaign => {
        return Promise.resolve().then(() => {
            const api = (url => resolveURL(program['rc.apiRoot'], `/api/${url}`));
            const beeswax = new BeeswaxClient({
                apiRoot: program['beeswax.apiRoot'],
                creds: {
                    email: program['beeswax.email'],
                    password: program['beeswax.password']
                }
            });
            const stream = new JsonProducer(program['kinesis.stream'], {
                region: program['kinesis.region']
            });

            return request.post(api('auth/login'), {
                json: {
                    email: program['rc.email'],
                    password: program['rc.password']
                }
            }).then(() => request.get(api('placements'), {
                qs: { 'tagParams.campaign': campaign }
            })).then(placements => Promise.all(placements.map(({ id }) => (
                request.delete(api(`placements/${id}`))
            )))).then(() => request.get(api(`campaigns/${campaign}`))).then(campaign => {
                const beeswaxID = get(campaign, 'externalIds.beeswax') ||
                    get(campaign, 'externalCampaigns.beeswax.externalId');

                if (!beeswaxID) { return campaign; }

                return request.put(api(`campaigns/${campaign.id}`), {
                    json: assign({}, campaign, {
                        externalCampaigns: {}
                    })
                }).then(campaign => (
                    beeswax.campaigns.delete(beeswaxID, false).then(() => campaign)
                ));
            }).then(campaign => request.put(api(`campaigns/${campaign.id}`), {
                json: assign({}, campaign, {
                    cards: []
                })
            })).then(campaign => {
                if (!program.produce) { return campaign; }

                return stream.produce({
                    type: 'campaignCreated',
                    data: {
                        campaign: campaign,
                        date: new Date().toISOString()
                    }
                });
            });
        }).catch(reason => process.nextTick(() => {
            throw reason;
        }));
    })
    .parse(process.argv);
