/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import count from '../../src/count';
import { expect } from './test-utils.spec';

describe('count', () =>
{
    it('should count elements in strings', () =>
    {
        const str = 'one...two';

        const c = count(str, (e) => e === 'o');

        expect(c).to.eql(2);
    });

    it('should count elements in arrays', () =>
    {
        const arr = [0,1,2,1,0];

        const c = count(arr, (e) => e === 0);

        expect(c).to.eql(2);
    });

    it('should count elements in objects', () =>
    {
        const obj = {x: 0, y: 3, z: 0};

        const c = count(obj, (e) => e === 0);

        expect(c).to.eql(2);
    });

    it('should count elements in arguments', () =>
    {
        const c = function args(...args) {return count(arguments, (e) => e === 0);}(0,1,2,1,0);

        expect(c).to.eql(2);
    });

    it('should count elements in sets', () =>
    {
        const set = new Set([0,1,2,1,0]);

        const c = count(set, (e) => e > 0);

        expect(c).to.eql(2);
    });

    it('should count elements in sets from and to a certain element', () =>
    {
        const arr = [1, 2, 1, 0, 4];

        const c = count(arr, (e) => e > 0, 1, 4);

        expect(c).to.eql(2);
    });
});
