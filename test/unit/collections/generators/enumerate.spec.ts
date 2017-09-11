/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import enumerate from '../../../../src/collections/generators/enumerate';
import { expect } from '../../test-utils.spec';

describe('generators/enumerate', () =>
{
    it('should enumerate any iterable including objects', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const m = enumerate(obj);

        expect([...m]).to.eql([['x', 0], ['y', 1], ['z', 2]]);
    });

    it('should enumerate any iterable between two keys', () =>
    {
        const arr = [5, 4, 2, 4, 3, 2, 1, 1];
        const m = enumerate(arr, 2, 4);

        expect([...m]).to.eql([[2, 2], [3, 4]]);
    });

    it('should return a generator', () =>
    {
        const arr = [5, 4, 2, 4, 3, 2, 1, 1];
        const m = enumerate(arr, 2, 4);

        expect(m.next()).to.eql({ value: [ 2, 2 ], done: false });
        expect(m.next()).to.eql({ value: [ 3, 4 ], done: false });
        expect(m.next()).to.eql({ value: undefined, done: true });
    });

    it('should be possible to enumerate over infinite generators', () =>
    {
        function* fibonacci()
        {
            let i0 = 1;
            let i1 = 0;

            while ( true )
            {
                yield i0;
                [i0, i1] = [i0 + i1, i0];
            }
        }

        const fib = fibonacci();
        const m   = enumerate(fib, 2, 5);

        expect(m.next()).to.eql({ value: [ 2, 2 ], done: false });
        expect(m.next()).to.eql({ value: [ 3, 3 ], done: false });
        expect(m.next()).to.eql({ value: [ 4, 5 ], done: false });
    });
});
