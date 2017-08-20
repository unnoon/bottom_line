/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import leftOfLast from '../../src/leftOfLast';
import { expect } from './test-utils.spec';

describe('leftOfLast', () =>
{
    it('should return the rest of the sequence if it contains the substring', () =>
    {
        const str = 'one...two...';

        const leftOfLastString = leftOfLast(str, '...');

        expect(leftOfLastString).to.eql('one...two');
        expect(str).to.eql('one...two...'); // string are immutable of course
    });

    it('should return the whole sequence in case the sub is not contained', () =>
    {
        const str = 'one...two';

        const leftOfLastString = leftOfLast(str, 'three');

        expect(leftOfLastString).to.eql('one...two');
    });

    it('should deal with multiple subs', () =>
    {
        const str = 'one...two...three';

        const leftOfLastString = leftOfLast(str, 'zero...', '..', '.');

        expect(leftOfLastString).to.eql('one...two');
    });

    it('should return the left of the array if it contains the element', () =>
    {
        const arr = [2, 3, 5, 3, 6, 5, 1];

        const leftOfLastArr = leftOfLast(arr, 5, 3);

        expect(leftOfLastArr).to.eql([2, 3, 5]);
        expect(arr).to.eql([2, 3, 5, 3, 6, 5, 1]);
    });
});
