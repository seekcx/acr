const test = require('ava');
const Acr = require('../src');
const Type = require('../src/type');
const Chain = require('../src/chain');

let acr;

test.beforeEach(() => {
    acr = new Acr({ locale: 'en' });
});

test('translate message', t => {
    let message = acr.translate('string.email');
    t.is(message, '{name || path} must be a valid email');

    message = acr.translate('string.email', 'zh-cn');
    t.is(message, '{name || path}应该是一个有效的邮箱');
});

test('custom locales', t => {
    const acr = new Acr({
        locales: {
            mars: {
                hi: '伱好'
            }
        }
    });

    const message = acr.translate('hi', 'mars');
    t.is(message, '伱好');
});

test('create a type', t => {
    const type = acr.type('test');

    t.true(type instanceof Type);
    t.is(type.name, 'test');

    // type should be a singleton
    t.true(type === acr.type('test'));

    t.true(acr.test() instanceof Chain);
});

test('async validate', async t => {
    const { foo, bax } = await acr.validate(
        {
            foo: 'bar',
            bax: 123
        },
        {
            foo: acr.string().equal('bar'),
            bax: acr
                .string({
                    transform: String
                })
                .equal('123')
        }
    );

    t.is(foo, 'bar');
    t.is(bax, '123');
});

test('async validate error', async t => {
    const promise = acr.validate(
        {},
        {
            foo: acr.string().required()
        }
    );

    const error = await t.throws(promise);
    t.is(error.name, 'ValidationError');
});

test('customize rule', async t => {
    acr.type('test').define('foo', (value, { params }) => {
        return Promise.resolve(value === params[0] ? null : false);
    });

    const chain = await acr
        .test()
        .foo('abel')
        .validate('abel');

    t.true(chain instanceof Chain);
});

test('should be failed when return a string', async t => {
    acr.type('test').define('bar', value => {
        return value;
    });

    const promise = acr
        .test()
        .bar()
        .validate('foobar');

    const error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('required', async t => {
    const { foo } = await acr.validate(
        {
            foo: 'bar'
        },
        {
            foo: acr.string().required()
        }
    );

    t.is(foo, 'bar');

    let promise = acr.validate(
        {
            bar: ''
        },
        {
            foo: acr.string().required(),
            bar: acr.string().required()
        }
    );

    let error = await t.throws(promise);

    t.is(error.errors[0].message, 'foo is a required field');
    t.is(error.errors[1].message, 'bar is a required field');

    promise = acr.validate(
        {},
        {
            foo: acr.string().required('foo is required')
        }
    );
    error = await t.throws(promise);
    t.is(error.errors[0].message, 'foo is required');

    // pass
    await acr.validate(
        {},
        {
            foo: acr.string().equal('bar')
        }
    );

    await acr.validate(
        {
            foo: 'bar'
        },
        {
            foo: acr.string().equal('bar')
        }
    );
});

test('transform', async t => {
    const { foo } = await acr.validate(
        {
            foo: 'bar'
        },
        {
            foo: acr.string().transform(() => 'bax')
        }
    );

    t.is(foo, 'bax');
});

test('default', async t => {
    const { foo, bar } = await acr.validate(
        {},
        {
            foo: acr.string().default('bar'),
            bar: acr.string().default(() => 'foo')
        }
    );

    t.is(foo, 'bar');
    t.is(bar, 'foo');
});
