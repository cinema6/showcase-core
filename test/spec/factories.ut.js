import { app } from '../../src/factories';
import * as appFactories from '../../src/factories/app';

describe('factories', function() {
    it('should export the app factories', function() {
        expect(app).toEqual(appFactories);
    });
});
