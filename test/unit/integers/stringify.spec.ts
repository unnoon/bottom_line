/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import stringify from '../../../src/integers/stringify';
import { expect } from '../test-utils.spec';

describe('integers/stringify', () =>
{
    it('should return the correct lead zeroed string based on a number', () =>
    {
        expect(stringify(0, '000000')).to.eql('000000');
        expect(stringify(5, '000000')).to.eql('000005');
        expect(stringify(6, '000000')).to.eql('000006');
        expect(stringify(9, '000000000')).to.eql('000000009');
        expect(stringify(10, '0000')).to.eql('0010');
        expect(stringify(50, '000')).to.eql('050');
        expect(stringify(51, '0000000000')).to.eql('0000000051');
        expect(stringify(99, '0000000')).to.eql('0000099');
        expect(stringify(100, '00')).to.eql('00');

        expect(stringify(-1, '00')).to.eql('99');
        expect(stringify(-6, '00')).to.eql('94');
        expect(stringify(-123, '00')).to.eql('77');
    });
});
