import * as showcaseFactories from '../../src/factories';
import * as showcaseBilling from '../../src/billing';
import { factories, billing } from '../../src';

describe('main exports', function() {
    it('should export all of the factories', function() {
        expect(factories).toEqual(showcaseFactories);
    });

    it('should export all of the billing', function() {
        expect(billing).toEqual(showcaseBilling);
    });
});
