'use strict';

import {
    createInterstitialFactory,
    createThreeHundredByTwoFiftyFactory
} from '../../src/factories/app';
import { find } from 'lodash';

describe('app factories', function() {
    let productData;

    beforeEach(function() {
        productData = {
            type: 'app',
            platform: 'iOS',
            name: 'iAnnotate 4 - read, markup and share PDFs and more',
            description: 'This app rules!',
            uri: 'https://itunes.apple.com/us/app/iannotate-4-read-markup-share/id1093924230?mt=8&uo=4',
            categories: [
                'Productivity',
                'Business'
            ],
            price: '$3.99',
            extID: 1093924230,
            developer: 'The App Shoppe Inc',
            rating: 4,
            images: [
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple20/v4/5f/05/da/5f05da2d-0680-c82b-4a90-349fd48573d7/screen322x572.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a5.mzstatic.com/us/r30/Purple18/v4/b3/89/fd/b389fde4-51c9-22d1-3613-c5ea3a4168b9/screen322x572.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a3.mzstatic.com/us/r30/Purple20/v4/4c/05/98/4c059850-f78f-87b7-aed6-51977732dcd8/screen322x572.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple30/v4/f0/c6/0a/f0c60a41-d3b8-1c6e-e7bc-a625b1590c5f/screen322x572.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a2.mzstatic.com/us/r30/Purple20/v4/f7/03/e1/f703e166-2ea6-07f2-67f9-84027811c87e/screen322x572.jpeg',
                    type: 'screenshot',
                    device: 'phone'
                },
                {
                    uri: 'http://a3.mzstatic.com/us/r30/Purple60/v4/a5/98/68/a5986803-66f9-ce15-afd7-ed1a2bdbd40c/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a4.mzstatic.com/us/r30/Purple30/v4/e0/31/3b/e0313b5b-94c5-340f-6793-034005b649b9/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a2.mzstatic.com/us/r30/Purple20/v4/e2/c3/62/e2c36200-fea7-165f-6adf-afb516cdbb4c/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a4.mzstatic.com/us/r30/Purple60/v4/8c/19/d7/8c19d77a-8738-8c11-f57a-535f693724f1/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://a1.mzstatic.com/us/r30/Purple20/v4/5a/f2/de/5af2de87-8ba5-07b2-0f90-f5d3cb0795bf/screen480x480.jpeg',
                    type: 'screenshot',
                    device: 'tablet'
                },
                {
                    uri: 'http://is1.mzstatic.com/image/thumb/Purple49/v4/df/4d/77/df4d77af-c3d8-671e-0bd2-a3ce288edbd5/source/512x512bb.jpg',
                    type: 'thumbnail'
                }
            ]
        };
    });

    describe('createInterstitialFactory(config)', function() {
        let config;
        let createInterstitial;

        beforeEach(function() {
            config = {
                cardType: 'showcase--app',
                slideCount: 3,
                countdown: 15,
                advanceInterval: 5,
                description: {
                    show: true,
                    autoHide: 3
                }
            };

            createInterstitial = createInterstitialFactory(config);
        });

        it('should return a Function', function() {
            expect(createInterstitial).toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
            let card;

            beforeEach(function() {
                card = createInterstitial(productData);
            });

            it('should return a reelcontent card', function() {
                expect(card).toEqual({
                    campaign: {
                        minViewTime: 0
                    },
                    collateral: {
                        logo: null
                    },
                    data: {
                        showDescription: config.description.show,
                        autoHideDescription: config.description.autoHide,
                        advanceInterval: config.advanceInterval,
                        skip: config.countdown,
                        rating: productData.rating,
                        price: productData.price,
                        slides: productData.images.filter(image => image.type === 'screenshot')
                            .filter(image => image.device === 'phone')
                            .map(image => ({
                                type: 'image',
                                uri: image.uri
                            }))
                            .slice(0, config.slideCount)
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
                            label: 'Download'
                        },
                        sponsor: productData.developer
                    },
                    shareLinks: {},
                    sponsored: true,
                    thumbs: {
                        small: find(productData.images, { type: 'thumbnail' }).uri,
                        large: find(productData.images, { type: 'thumbnail' }).uri
                    },
                    title: productData.name,
                    type: config.cardType
                });
            });

            describe('if the app rating is below 4', function() {
                beforeEach(function() {
                    productData.rating = 3.5;

                    card = createInterstitial(productData);
                });

                it('should not be added', function() {
                    expect(card).toEqual(jasmine.objectContaining({
                        data: jasmine.objectContaining({
                            rating: null
                        })
                    }));
                });
            });

            describe('if the app is free', function() {
                beforeEach(function() {
                    productData.price = 'Free';

                    card = createInterstitial(productData);
                });

                it('should make the CTA read "Download for Free"', function() {
                    expect(card).toEqual(jasmine.objectContaining({
                        params: jasmine.objectContaining({
                            action: jasmine.objectContaining({
                                label: 'Download for Free'
                            })
                        })
                    }));
                });
            });
        });
    });

    describe('createThreeHundredByTwoFiftyFactory(config)', function() {
        let config;
        let createThreeHundredByTwoFifty;

        beforeEach(function() {
            config = {
                cardType: 'showcase--app--300x250',
                countdown: 30
            };

            createThreeHundredByTwoFifty = createThreeHundredByTwoFiftyFactory(config);
        });

        it('should call createInterstitial()', function() {
            expect(createThreeHundredByTwoFifty(productData)).toEqual(createInterstitialFactory(config)(productData));
        });
    });
});
