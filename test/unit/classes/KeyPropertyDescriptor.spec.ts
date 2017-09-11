/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import KeyPropertyDescriptor from '../../../src/classes/KeyPropertyDescriptor';
import { expect } from '../test-utils.spec';

describe('KeyPropertyDescriptor', () =>
{
    it('should have basic properties', () =>
    {
        const kpd = new KeyPropertyDescriptor();

        expect(kpd.enumerable).to.be.false;
        expect(kpd.configurable).to.be.false;
        expect(kpd.writable).to.be.false;
        expect(kpd.needsAccessorTarget).to.be.false;

        let tmp = 10;

        kpd.value = 10;
        kpd.get   = () => tmp;
        kpd.value = (v) => tmp = v;
    });

    describe('key', () =>
    {
        it('should be possible to set an optional key and retrieve it', () =>
        {
            const kpd = new KeyPropertyDescriptor().key('chain');

            expect(kpd.key()).to.eql('chain');
        });
    });

    describe('descriptor', () =>
    {
        it('should be possible add properties from an existing descriptor', () =>
        {
            const kpd = new KeyPropertyDescriptor();

            expect(kpd.enumerable).to.be.false;
            expect(kpd.configurable).to.be.false;
            expect(kpd.writable).to.be.false;

            let tmp  = 10;
            let tmp2 = 20;

            kpd.value = 10;
            kpd.get   = () => tmp;
            kpd.value = (v) => tmp = v;

            const desc = {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 20,
                get: () => tmp2,
                set: (v) => tmp2 = v,
            };

            expect(kpd.descriptor(desc)).to.eql(kpd);
            expect(kpd.enumerable).to.be.true;
            expect(kpd.configurable).to.be.true;
            expect(kpd.writable).to.be.true;
            expect(kpd.value).to.eql(20);
            expect(kpd.get()).to.eql(20);
            expect(kpd.set(30)).to.eql(30);
            expect(kpd.get()).to.eql(30);
        });

        it('should be return a groomed proper clone', () =>
        {
            const kpd = new KeyPropertyDescriptor();

            let tmp2  = 20;

            const desc = {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 20,
                get: () => tmp2,
                set: (v) => tmp2 = v,
            };

            expect(kpd.descriptor(desc)).to.eql(kpd);

            const kpd2 = kpd.descriptor();

            expect(kpd2).not.to.eql(kpd);
            expect(kpd2.enumerable).to.be.true;
            expect(kpd2.configurable).to.be.true;
            expect(kpd2.hasOwnProperty('writable')).to.be.false;
            expect(kpd2.hasOwnProperty('value')).to.be.false;
            expect(kpd2.get()).to.eql(20);
            expect(kpd2.set(30)).to.eql(30);
            expect(kpd2.get()).to.eql(30);
        });
    });

    describe('groom', () =>
    {
        it('should groom the current descriptor', () =>
        {
            const kpd = new KeyPropertyDescriptor();

            let tmp2  = 20;

            const desc = {
                writable: true,
                value: 20,
                get: () => tmp2,
                set: (v) => tmp2 = v,
            };

            expect(kpd.descriptor(desc)).to.eql(kpd);

            kpd.groom();

            expect(kpd).to.eql(kpd);
            expect(kpd.hasOwnProperty('writable')).to.be.false;
            expect(kpd.hasOwnProperty('value')).to.be.false;
            expect(kpd.get()).to.eql(20);
            expect(kpd.set(30)).to.eql(30);
            expect(kpd.get()).to.eql(30);
        });
    });

    describe('onaccess', () =>
    {
        it('should be easy to add an onaccess wrapper', () =>
        {
            const kpd = new KeyPropertyDescriptor();

            let tmp = 20;

            const desc = {
                get: ()  => tmp,
                set: (v) => tmp = v,
            };

            const fn = (v) => v + 10;

            expect(kpd.descriptor(desc)).to.eql(kpd);
            expect(kpd.onaccess(fn)).to.eql(kpd);

            expect(kpd.get()).to.eql(30);
        });

        it('should supply identity accessors in case no accessors are present', () =>
        {
            const kpd = new KeyPropertyDescriptor().key('id');

            kpd['_id'] = 10;

            const fn = (v) => v + 10;

            expect(kpd.onaccess(fn)).to.eql(kpd);
            expect(kpd.get()).to.eql(20);
            expect(kpd.set(20)).to.eql(20);
            expect(kpd.get()).to.eql(30);
        });

        it('should throw an error in case an identity getter is needed and no key is supplied', () =>
        {
            const kpd = new KeyPropertyDescriptor();

            const fn = (v) => v + 10;
            const addOnaccess = () => kpd.onaccess(fn);

            expect(addOnaccess).to.throw('Property key is not defined.');
        });

        it('should throw an error in case an identity setter is needed and no key is supplied', () =>
        {
            const kpd = new KeyPropertyDescriptor();

            kpd.get = function() {return this._id;};
            kpd['_id'] = 10;

            const fn = (v) => v + 10;
            const addOnaccess = () => kpd.onaccess(fn);

            expect(addOnaccess).to.throw('Property key is not defined.');
        });
    });

    describe('onupdate', () =>
    {
        it('should be easy to add an onupdate wrapper', () =>
        {
            const kpd = new KeyPropertyDescriptor();

            let tmp = 20;

            const desc = {
                get: ()  => tmp,
                set: (v) => tmp = v,
            };

            const fn = (v) => v + 10;

            expect(kpd.descriptor(desc)).to.eql(kpd);
            expect(kpd.onupdate(fn)).to.eql(kpd);

            expect(kpd.set(20)).to.eql(30);
            expect(kpd.get()).to.eql(30);
        });
    });

    describe('onexecute', () =>
    {
        it('should be easy to add an onexecute wrapper', () =>
        {
            /* tslint:disable-next-line:ban-types */
            const kpd = new KeyPropertyDescriptor<Function>();

            kpd.value = (v) => v + 10;

            const fn = (v) => v + 10;

            expect(kpd.onexecute(fn)).to.eql(kpd);

            expect(kpd.value(20)).to.eql(40);
        });
    });

    describe('defineProperty', () =>
    {
        it('should define static properties', () =>
        {
            const kpd = new KeyPropertyDescriptor().key('id');

            const fn = (v) => v + 10;
            
            kpd.value = 10;
            kpd.enumerable   = true;
            kpd.configurable = true;

            expect(kpd.onaccess(fn)).to.eql(kpd);

            class TestDefineProperty
            {

            }

            kpd.defineProperty(TestDefineProperty);

            expect(TestDefineProperty['id']).to.eql(20);
            expect(TestDefineProperty.hasOwnProperty('id')).to.be.true;
            expect(Object.getOwnPropertyDescriptor(TestDefineProperty, 'id').enumerable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(TestDefineProperty, 'id').configurable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(TestDefineProperty, 'id').writable).to.be.undefined;
            expect(TestDefineProperty['_id']).to.eql(10);
            expect(TestDefineProperty.hasOwnProperty('_id')).to.be.true;
            expect(Object.getOwnPropertyDescriptor(TestDefineProperty, '_id').enumerable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(TestDefineProperty, '_id').configurable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(TestDefineProperty, '_id').writable).to.be.false;
        });

        it('should define wrapped instance properties', () =>
        {
            const kpd = new KeyPropertyDescriptor().key('id');

            const fn = (v) => v + 10;

            kpd.value        = 10;
            kpd.enumerable   = true;
            kpd.configurable = true;
            kpd.writable     = true;

            expect(kpd.onaccess(fn)).to.eql(kpd);

            class TestDefineProperty
            {
                public id;

                constructor()
                {
                    this.id;
                }
            }

            const proto = TestDefineProperty.prototype;
            
            kpd.defineProperty(proto);

            const tdp = new TestDefineProperty();

            expect(kpd.needsAccessorTarget).to.be.true;

            expect(proto.hasOwnProperty('id')).to.be.true;
            expect(Object.getOwnPropertyDescriptor(proto, 'id').enumerable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(proto, 'id').configurable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(proto, 'id').writable).to.be.undefined;

            expect(tdp['id']).to.eql(20);
            expect(tdp.hasOwnProperty('id')).to.be.true;
            expect(Object.getOwnPropertyDescriptor(tdp, 'id').enumerable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(tdp, 'id').configurable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(tdp, 'id').writable).to.be.undefined;

            expect(tdp['_id']).to.eql(10);
            expect(tdp.hasOwnProperty('_id')).to.be.true;
            expect(Object.getOwnPropertyDescriptor(tdp, '_id').enumerable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(tdp, '_id').configurable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(tdp, '_id').writable).to.be.true;
        });

        it('should define instance properties', () =>
        {
            const kpd = new KeyPropertyDescriptor().key('id');

            kpd.value        = 10;
            kpd.enumerable   = true;
            kpd.configurable = true;
            kpd.writable     = true;

            class TestDefineProperty
            {
                public id;

                constructor()
                {
                    this.id;
                }
            }

            const proto = TestDefineProperty.prototype;

            kpd.defineProperty(proto);

            const tdp = new TestDefineProperty();

            expect(tdp['id']).to.eql(10);
            expect(tdp.hasOwnProperty('id')).to.be.true;
            expect(Object.getOwnPropertyDescriptor(tdp, 'id').enumerable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(tdp, 'id').configurable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(tdp, 'id').writable).to.be.true;
        });
    });
});
