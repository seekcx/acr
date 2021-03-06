const test = require('ava');
const { isEmpty, isEqual } = require('lodash');
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

    const error = await t.throwsAsync(promise);
    t.is(error.name, 'ValidationError');
});

test('customize rule', async t => {
    acr.type('test').define('equal', (value, { params }) => {
        return Promise.resolve(value === params[0] ? null : false);
    });

    const value = await acr
        .test()
        .equal('abel')
        .validate('abel');

    t.is(value, 'abel');
});

test('should be failed when return a string', async t => {
    acr.type('test').define('bar', value => {
        return value;
    });

    const error = await t.throwsAsync(async () => {
        await acr
            .test()
            .bar()
            .validate('foobar');
    });
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

    let error = await t.throwsAsync(async () => {
        await acr.validate(
            {
                bar: ''
            },
            {
                foo: acr.string().required(),
                bar: acr.string().required()
            }
        );
    });

    t.is(error.errors[0].message, 'foo is a required field');
    t.is(error.errors[1].message, 'bar is a required field');

    error = await t.throwsAsync(async () => {
        await acr.validate(
            {},
            {
                foo: acr.string().required('foo is required')
            }
        );
    });
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

test('transform-async', async t => {
    const { foo } = await acr.validate(
        {
            foo: 'bar'
        },
        {
            foo: acr.string().transform(async () => {
                return new Promise(resolve => {
                    setTimeout(() => resolve('bax'), 100);
                });
            })
        }
    );

    t.is(foo, 'bax');
});

test('as', async t => {
    const { bar } = await acr.validate(
        {
            foo: 'bar'
        },
        {
            foo: acr.string().as('bar')
        }
    );

    t.is(bar, 'bar');
});

test('optional', async t => {
    const data = await acr.validate(
        {},
        {
            foo: acr.string().optional()
        }
    );

    t.true(isEmpty(data));
});

test('optional-multiple', async t => {
    const data = await acr.validate(
        {
            a: 'a',
            c: 'c'
        },
        {
            a: acr.string('a').optional(),
            b: acr.string().optional(),
            c: acr.string().optional(),
            d: acr.string().optional()
        }
    );

    t.true(isEqual(data, { a: 'a', c: 'c' }));
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

test('when', async t => {
    const promise = acr.validate(
        {
            name: 'abel',
            age: 18,
            bio: 'abcdefg',
            number: '18912345678'
        },
        {
            age: acr
                .when(
                    data => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                resolve(data.name === 'tom');
                            }, 10);
                        });
                    },
                    () => {
                        return acr.number().min(10);
                    }
                )
                .when('name', 'abel', () => {
                    return acr.number().min(20);
                }),
            bio: acr
                .when('name', 'jack', () => {
                    return acr.string().min(5);
                })
                .other(() => {
                    return acr.string().min(10);
                }),
            number: acr.when('name', 'jack', () => {
                return acr.string().equal('18912345678');
            })
        }
    );

    const error = await t.throwsAsync(promise);

    t.is(error.errors[0].message, 'age must be less than or equal to 20');
    t.is(error.errors[1].message, 'bio must be at least 10 characters');
});
