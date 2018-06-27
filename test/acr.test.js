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
