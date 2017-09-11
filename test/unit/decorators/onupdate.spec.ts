/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { onupdate }              from '../../../src/decorators/onupdate';
import { expect }                from '../test-utils.spec';

describe('decorators/onupdate', () =>
{
    it('should be easy to to add an onupdate hook', () =>
    {
        const property       = {result: ''};
        const getter         = {result: ''};
        const staticProperty = {result: ''};

        const pfn = (v) => {property.result       = v; return v;};
        const gfn = (v) => {getter.result         = v; return v;};
        const sfn = (v) => {staticProperty.result = v; return v;};

        class OnupdateTest
        {
            @onupdate(sfn)
            public static gazpacho = 'cold';

            public pepper = 'black';

            @onupdate(pfn)
            public soup = 'warm';

            @onupdate<() => string>(gfn)
            public set spices(v) {this.pepper = v;}
            public get spices()  {return this.pepper;}
        }

        const ol = new OnupdateTest();

        expect(ol.soup).to.eql('warm');
        expect(ol.spices).to.eql('black');

        expect(OnupdateTest.gazpacho).to.eql('cold');

        ol.soup = 'hot';
        ol.spices = 'white';

        OnupdateTest.gazpacho = 'coldish';

        expect(property.result).to.eql(ol.soup);
        expect(getter.result).to.eql(ol.spices);
        expect(staticProperty.result).to.eql(OnupdateTest.gazpacho);
    });
});
