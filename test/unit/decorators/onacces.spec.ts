/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { onaccess }              from '../../../src/decorators/onaccess';
import { expect }                from '../test-utils.spec';

describe('decorators/onaccess', () =>
{
    it('should be easy to to add an onaccess hook', () =>
    {
        const property       = {result: ''};
        const getter         = {result: ''};
        const staticProperty = {result: ''};

        const pfn = (v) => {property.result       = 'accessed'; return v;};
        const gfn = (v) => {getter.result         = 'accessed'; return v;};
        const sfn = (v) => {staticProperty.result = 'accessed'; return v;};

        class OnaccessTest
        {
            @onaccess(sfn)
            public static gazpacho = 'cold';

            public pepper = 'black';

            @onaccess(pfn)
            public        soup = 'warm';

            @onaccess<() => string>(gfn)
            public        get spices() {return this.pepper;}
        }

        const ol = new OnaccessTest();

        expect(ol.soup).to.eql('warm');
        expect(ol.spices).to.eql('black');

        expect(OnaccessTest.gazpacho).to.eql('cold');

        expect(property.result).to.eql('accessed');
        expect(getter.result).to.eql('accessed');
        expect(staticProperty.result).to.eql('accessed');
    });
});
