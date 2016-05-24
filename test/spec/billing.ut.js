import { getPaymentPlanStart } from '../../src/billing';
import { createUuid } from 'rc-uuid';
import moment from 'moment';

function createId(prefix) {
    return `${prefix}-${createUuid()}`;
}

describe('billing', function() {
    beforeEach(function() {
        jasmine.clock().install();
        jasmine.clock().mockDate();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    describe('getPaymentPlanStart(promotions, now)', function() {
        beforeEach(function() {
            this.promotions = [
                {
                    id: createId('ref'),
                    status: 'active',
                    created: moment().subtract(6, 'months').format(),
                    lastUpdated: moment().subtract(6, 'months').format(),
                    name: '10-Day Free Trial',
                    type: 'freeTrial',
                    data: {
                        trialLength: 10
                    }
                },
                {
                    id: createId('ref'),
                    status: 'active',
                    created: moment().subtract(7, 'months').format(),
                    lastUpdated: moment().subtract(7, 'months').format(),
                    name: '$50 Bonus',
                    type: 'signupReward',
                    data: {
                        rewardAmount: 50
                    }
                },
                {
                    id: createId('ref'),
                    status: 'active',
                    created: moment().subtract(8, 'months').format(),
                    lastUpdated: moment().subtract(8, 'months').format(),
                    name: 'One Week Free Trial',
                    type: 'freeTrial',
                    data: {
                        trialLength: 7
                    }
                }
            ];
            this.now = moment('2016-05-15');

            this.result = getPaymentPlanStart(this.promotions, this.now);
        });

        it('should return a moment for now + the length of their trials', function() {
            const expected = moment(this.now).add(17, 'days');
            expect(this.result.isSame(expected)).toBe(true, `Moment is for ${this.result.format()}, not ${expected.format()}`);
        });

        describe('if there are no promotions', function() {
            beforeEach(function() {
                this.promotions = [
                    {
                        id: createId('ref'),
                        status: 'active',
                        created: moment().subtract(7, 'months').format(),
                        lastUpdated: moment().subtract(7, 'months').format(),
                        name: '$50 Bonus',
                        type: 'signupReward',
                        data: {
                            rewardAmount: 50
                        }
                    }
                ];
                this.now = moment('2016-05-15');

                this.result = getPaymentPlanStart(this.promotions, this.now);
            });

            it('should return now', function() {
                const expected = moment(this.now);
                expect(this.result.isSame(expected)).toBe(true, `Moment is for ${this.result.format()}, not ${expected.format()}`);
            });
        });

        describe('if no now is specified', function() {
            beforeEach(function() {
                this.result = getPaymentPlanStart(this.promotions);
            });

            it('should use the current time', function() {
                const expected = moment().add(17, 'days');
                expect(this.result.isSame(expected)).toBe(true, `Moment is for ${this.result.format()}, not ${expected.format()}`);
            });
        });
    });
});
