/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import leftOf from '../../src/leftOf';
import { expect } from './test-utils.spec';

describe('leftOf', () =>
{
    it('should return the rest of the sequence if it contains the substring', () =>
    {
        const str = 'one...two';

        const leftOfString = leftOf(str, '...');

        expect(leftOfString).to.eql('one');
        expect(str).to.eql('one...two'); // string are immutable of course
    });

    it('should return the whole sequence in case the sub is not contained', () =>
    {
        const str = 'one...two';

        const leftOfString = leftOf(str, 'three');

        expect(leftOfString).to.eql('one...two');
    });

    it('should deal with multiple subs', () =>
    {
        const str = 'one...two...three';

        const leftOfString = leftOf(str, 'zero...', '...', 'ne');

        expect(leftOfString).to.eql('o');
    });

    it('should return the left of the array if it contains the element', () =>
    {
        const arr = [2, 3, 5, 3, 6];

        const leftOfArr = leftOf(arr, 5);

        expect(leftOfArr).to.eql([2, 3]);
        expect(arr).to.eql([2, 3, 5, 3, 6]);
    });
});
