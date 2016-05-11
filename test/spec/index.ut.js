import * as showcaseFactories from '../../src/factories';
import { factories } from '../../src';

describe('main exports', function() {
    it('should export all of the factories', function() {
        expect(factories).toEqual(showcaseFactories);
    });
});
