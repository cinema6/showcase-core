import _ from 'lodash';
import moment from 'moment';

export function getPaymentPlanStart(promotions, now = moment()) {
    const trialLength = _(promotions)
        .filter({ type: 'freeTrial' })
        .map('data.trialLength')
        .sum();

    return moment(now).add(trialLength, 'days');
}
