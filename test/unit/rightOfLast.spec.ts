/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import rightOfLast from '../../src/rightOfLast';
import { expect } from './test-utils.spec';

describe('rightOfLast', () =>
{
    it('should return the rest of the sequence if it contains the sub', () =>
    {
        const str = 'one...two';

        const rightOfLastString = rightOfLast(str, '..');

        expect(rightOfLastString).to.eql('two');
        expect(str).to.eql('one...two'); // string are immutable of course
    });

    it('should return the whole sequence in case the sub is not contained', () =>
    {
        const str = 'one...two';

        const rightOfLastString = rightOfLast(str, 'three');

        expect(rightOfLastString).to.eql('one...two');
    });

    it('should deal with multiple subs', () =>
    {
        const str = 'one...two...three';

        const rightOfLastString = rightOfLast(str, 'zero...', '..');

        expect(rightOfLastString).to.eql('three');
    });

    it('should return the rest of the array if it contains the element', () =>
    {
        const arr = [2, 3, 5, 3, 6];

        const rightOfLastArr = rightOfLast(arr, 3);

        expect(rightOfLastArr).to.eql([6]);
        expect(arr).to.eql([2, 3, 5, 3, 6]);
    });
});
