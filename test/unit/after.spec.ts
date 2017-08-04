/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import after from '../../src/after';
import { expect } from './test-utils';

describe('after', () =>
{
    it('should return the rest of the string if it contains the substring', () =>
    {
        const str = 'one...two';

        const afterString = after(str, '...');

        expect(afterString).to.eql('two');
        expect(str).to.eql('one...two'); // string are immutable of course
    });

    it('should return the whole string in case the substring is not contained', () =>
    {
        const str = 'one...two';

        const afterString = after(str, 'three');

        expect(afterString).to.eql('one...two');
    });

    it('should return an empty string in case no input is given', () =>
    {
        const str = undefined;

        const afterString1 = after(str, 'three');
        const afterString2 = after(str);

        expect(afterString1).to.eql('');
        expect(afterString2).to.eql('');
    });

    it('should deal with multiple substrings', () =>
    {
        const str = 'one...two...three';

        const afterString = after(str, 'zero...', '...', 'two');

        expect(afterString).to.eql('...three');
    });
});
