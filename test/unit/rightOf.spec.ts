/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import rightOf from '../../src/rightOf';
import { expect } from './test-utils.spec';

describe('rightOf', () =>
{
    it('should return the rest of the string if it contains the substring', () =>
    {
        const str = 'one...two';

        const rightOfString = rightOf(str, '...');

        expect(rightOfString).to.eql('two');
        expect(str).to.eql('one...two'); // string are immutable of course
    });

    it('should return the whole string in case the substring is not contained', () =>
    {
        const str = 'one...two';

        const rightOfString = rightOf(str, 'three');

        expect(rightOfString).to.eql('one...two');
    });

    it('should return an empty string in case no input is given', () =>
    {
        const str = undefined;

        const rightOfString1 = rightOf(str, 'three');
        const rightOfString2 = rightOf(str);

        expect(rightOfString1).to.eql('');
        expect(rightOfString2).to.eql('');
    });

    it('should deal with multiple substrings', () =>
    {
        const str = 'one...two...three';

        const rightOfString = rightOf(str, 'zero...', '...', 'two');

        expect(rightOfString).to.eql('...three');
    });
});
