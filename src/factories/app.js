'use strict';

import _ from 'lodash';


/***************************************************************************************************
 * Contains the logic to translate productData for an app into an interstitial MiniReel Player
 * creative.
 *
 * Has the following "inteligence":
 *
 *     * Only displays the app's rating if it at least 4 stars
 *     * Changes the CTA to be "Download for Free" if the app is free
 **************************************************************************************************/
export function createInterstitialFactory({
    duration = 30,
    slideCount = Infinity,
    cardType = 'showcase--app'
}) {
    return function createInterstitial(productData) {
        const thumbnail = _(productData.images).find({ type: 'thumbnail' }).uri;
        const { rating, price } = productData;

        return {
            campaign: {
                minViewTime: 0
            },
            collateral: {
                logo: null
            },
            data: {
                duration,
                price,
                rating: rating >= 4 ? rating : null, // Only show the rating if it is above 4
                slides: _(productData.images)
                    .filter({ type: 'screenshot', device: 'phone' })
                    .map(({ uri }) => ({ type: 'image', uri }))
                    .take(slideCount)
                    .value()
            },
            links: {
                Action: {
                    uri: productData.uri,
                    tracking: []
                }
            },
            modules: [],
            note: productData.description,
            params: {
                action: {
                    type: 'button',
                    label: (() => {
                        switch (price.toLowerCase()) {
                        case 'free':
                            return 'Download for Free';
                        default:
                            return 'Download';
                        }
                    })()
                },
                sponsor: productData.developer
            },
            shareLinks: {},
            sponsored: true,
            thumbs: {
                small: thumbnail,
                large: thumbnail
            },
            title: productData.name,
            type: cardType
        };
    };
}

/***************************************************************************************************
 * Contains the logic to translate productData for an app into a 300x250 MiniReel Player creative.
 *
 * Right now, there is no difference between 300x250 cards and interstitial cards (from a data
 * perspective,) so this function just calls the interstitial factory function.
 **************************************************************************************************/
export function createThreeHundredByTwoFiftyFactory(config) {
    return createInterstitialFactory(config);
}
