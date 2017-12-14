/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import rightOf from '../../../src/sequences/rightOf';
import { expect } from '../test-utils.spec';

describe('sequences/rightOf', () =>
{
    it('should return the rest of the sequence if it contains the substring', () =>
    {
        const str = 'one...two';

        const rightOfString = rightOf(str, '...');

        expect(rightOfString).to.eql('two');
        expect(str).to.eql('one...two'); // string are immutable of course
    });

    it('should return the whole sequence in case the sub is not contained', () =>
    {
        const str = 'one...two';

        const rightOfString = rightOf(str, 'three');

        expect(rightOfString).to.eql('one...two');
    });

    it('should deal with multiple subs', () =>
    {
        const str = 'one...two...three';

        const rightOfString = rightOf(str, 'zero...', '...', 'two');

        expect(rightOfString).to.eql('...three');
    });

    it('should return the rest of the array if it contains the element', () =>
    {
        const arr = [2, 3, 5, 3, 6];

        const rightOfArr = rightOf(arr, 3);

        expect(rightOfArr).to.eql([5, 3, 6]);
        expect(arr).to.eql([2, 3, 5, 3, 6]);
    });

    it('should work on arraylikes', () =>
    {
        const arraylike =  {
            0: 2,
            1: 3,
            2: 5,
            3: 3,
            4: 6,
            length: 5,
        };

        const leftOfArrayLike = rightOf(arraylike, 3);

        expect(leftOfArrayLike).to.eql([5, 3, 6]);
        expect(arraylike).to.eql({
            0: 2,
            1: 3,
            2: 5,
            3: 3,
            4: 6,
            length: 5,
        });
    });
});
