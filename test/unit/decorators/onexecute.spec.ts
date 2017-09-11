/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { onexecute }              from '../../../src/decorators/onexecute';
import { expect }                from '../test-utils.spec';

describe('decorators/onexecute', () =>
{
    it('should be easy to to add an onexecute hook', () =>
    {
        const method         = {result: ''};
        const staticMethod   = {result: ''};

        const mfn = (o) => {method.result       = o; return o;};
        const sfn = (o) => {staticMethod.result = o; return o;};

        class OnexecuteTest
        {
            @onexecute<() => string>(sfn) public static prepare() {return 'gazpacho';}
            @onexecute<() => string>(mfn) public        prepare() {return 'soup';}
        }

        const ol = new OnexecuteTest();

        expect(ol.prepare()).to.eql('soup');
        expect(OnexecuteTest.prepare()).to.eql('gazpacho');

        expect(method.result).to.eql('soup');
        expect(staticMethod.result).to.eql('gazpacho');
    });
});
