/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { decorator }             from '../../../src/decorators/decorator';
import { nonconfigurable }       from '../../../src/decorators/nonconfigurable';
import { nonenumerable }         from '../../../src/decorators/nonenumerable';
import { KeyPropertyDescriptor } from '../../../src/classes/KeyPropertyDescriptor';
import { expect }                from '../test-utils.spec';

function onaccessdec<T>(resultObj)
{
    return decorator<T>((target, key, descriptor) =>
    {
        // tslint:disable-next-line:only-arrow-functions
        (descriptor as KeyPropertyDescriptor<any>).onaccess(function(v)
        {
            resultObj.result = 'accessed';

            return v;
        });
    });
}

function onupdatedec<T>(resultObj)
{
    return decorator<T>((target, key, descriptor) =>
    {
        // tslint:disable-next-line:only-arrow-functions
        (descriptor as KeyPropertyDescriptor<any>).onupdate(function(v)
        {
            resultObj.result = v;

            return v;
        });
    });
}

function onexecutedec<T>(resultObj)
{
    return decorator<T>((target, key, descriptor) =>
    {
        // tslint:disable-next-line:only-arrow-functions
        (descriptor as KeyPropertyDescriptor<any>).onexecute(function(o)
        {
            resultObj.result = o;

            return o;
        });
    });
}

describe('decorators/decorator', () =>
{
    describe('onaccess', () =>
    {
        it('should be easy to create decorators by using onaccess', () =>
        {
            const property       = {result: ''};
            const getter         = {result: ''};
            const staticProperty = {result: ''};

            class OnaccessTest
            {
                @onaccessdec(staticProperty)             public static gazpacho = 'cold';

                public pepper = 'black';

                @onaccessdec(property)                   public        soup = 'warm';
                @onaccessdec<() => string>(getter)       public        get spices() {return this.pepper;}
            }

            const ol = new OnaccessTest();

            expect(ol.soup).to.eql('warm');
            expect(ol.spices).to.eql('black');

            expect(OnaccessTest.gazpacho).to.eql('cold');

            expect(property.result).to.eql('accessed');
            expect(getter.result).to.eql('accessed');
            expect(staticProperty.result).to.eql('accessed');
        });
    });

    describe('onupdate', () =>
    {
        it('should be easy to create decorators by using onupdate', () =>
        {
            const property       = {result: ''};
            const getter         = {result: ''};
            const staticProperty = {result: ''};

            class OnupdateTest
            {
                @onupdatedec(staticProperty)
                public static gazpacho = 'cold';

                public pepper = 'black';

                @onupdatedec(property)
                public        soup = 'warm';

                @onupdatedec<() => string>(getter)
                public set spices(v) {this.pepper = v;}
                public get spices()  {return this.pepper;}
            }

            const ol = new OnupdateTest();

            expect(ol.soup).to.eql('warm');
            expect(ol.spices).to.eql('black');

            expect(OnupdateTest.gazpacho).to.eql('cold');

            ol.soup = 'hot';
            ol.spices = 'white';

            OnupdateTest.gazpacho = 'coldish';

            expect(property.result).to.eql(ol.soup);
            expect(getter.result).to.eql(ol.spices);
            expect(staticProperty.result).to.eql(OnupdateTest.gazpacho);
        });
    });

    describe('onexecute', () =>
    {
        it('should be easy to create decorators by using onexecute', () =>
        {
            const method         = {result: ''};
            const staticMethod   = {result: ''};

            class OnexecuteTest
            {
                @onexecutedec<() => string>(staticMethod) public static prepare() {return 'gazpacho';}
                @onexecutedec<() => string>(method)       public        prepare() {return 'soup';}
            }

            const ol = new OnexecuteTest();

            expect(ol.prepare()).to.eql('soup');
            expect(OnexecuteTest.prepare()).to.eql('gazpacho');

            expect(method.result).to.eql('soup');
            expect(staticMethod.result).to.eql('gazpacho');
        });
    });    
    
    describe('combining decorators', () =>
    {
        it('we should be able to combine simple decorators', () =>
        {
            class Fish
            {
                @nonconfigurable
                @nonenumerable
                public static soup   = 'warm';

                public static quiche = 'warm';

                @nonconfigurable
                @nonenumerable
                public soup   = 'warm';

                public quiche = 'warm';
            }

            const fish = new Fish();

            expect(Object.getOwnPropertyDescriptor(fish, 'soup').configurable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(fish, 'soup').enumerable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(fish, 'quiche').configurable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(fish, 'quiche').enumerable).to.be.true;

            expect(Object.getOwnPropertyDescriptor(Fish, 'soup').configurable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(Fish, 'soup').enumerable).to.be.false;
            expect(Object.getOwnPropertyDescriptor(Fish, 'quiche').configurable).to.be.true;
            expect(Object.getOwnPropertyDescriptor(Fish, 'quiche').enumerable).to.be.true;
        });

        it('should be possible to combine onaccess & onupdate', () =>
        {
            const aproperty        = {result: ''};
            const aproperty2       = {result: ''};
            const agetter          = {result: ''};
            const astaticProperty  = {result: ''};
            const astaticProperty2 = {result: ''};

            const uproperty       = {result: ''};
            const ugetter         = {result: ''};
            const ustaticProperty = {result: ''};

            class OnupdateTest
            {
                @onaccessdec(astaticProperty)  @onupdatedec(ustaticProperty) @onaccessdec(astaticProperty2) public static gazpacho = 'cold';

                public pepper = 'black';

                @onaccessdec(aproperty) @onupdatedec(uproperty) @onaccessdec(aproperty2) public       soup = 'warm';
                @onaccessdec<() => string>(agetter) @onupdatedec<() => string>(ugetter)  public       set spices(v) {this.pepper = v;}
                public get spices() {return this.pepper;}
            }

            const ol = new OnupdateTest();

            expect(ol.soup).to.eql('warm');
            expect(ol.spices).to.eql('black');

            expect(OnupdateTest.gazpacho).to.eql('cold');

            ol.soup = 'hot';
            ol.spices = 'white';

            OnupdateTest.gazpacho = 'coldish';

            expect(uproperty.result).to.eql(ol.soup);
            expect(ugetter.result).to.eql(ol.spices);
            expect(ustaticProperty.result).to.eql(OnupdateTest.gazpacho);

            expect(aproperty.result).to.eql('accessed');
            expect(aproperty2.result).to.eql('accessed');
            expect(agetter.result).to.eql('accessed');
            expect(astaticProperty.result).to.eql('accessed');
            expect(astaticProperty2.result).to.eql('accessed');
        });
    });

    describe('class decorator', () =>
    {
        it('should create a class decorator', () =>
        {
            const tag = decorator((target) =>
            {
                target['tag'] = 'tagged';
            });

            @tag
            class TaggedClass
            {

            }

            expect(TaggedClass['tag']).to.eql('tagged');
        });
    });

    describe('parameter decorator', () =>
    {
        it('should create a class decorator', () =>
        {
            const parameter = {result: ''};

            const paradec = decorator((target, key, index) =>
            {
                parameter.result = `${key} ${index}`;
            });

            class ParClass
            {
                public para(@paradec noid)
                {
                    return 'para' + noid;
                }
            }

            const pc = new ParClass();

            expect(pc.para('noid')).to.eql('paranoid');
            expect(parameter.result).to.eql('para 0');
        });
    });
});
