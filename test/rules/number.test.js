const test = require('ava');
const Acr = require('../../src');

let acr;
test.beforeEach(() => {
    acr = new Acr({ locale: 'en' });
});

test('equal', async t => {
    const value = await acr
        .number()
        .equal(12)
        .validate(12);
    t.is(value, 12);

    let error = await t.throwsAsync(async () => {
        await acr
            .number({ name: 'test' })
            .equal(12)
            .validate(16);
    });
    t.is(error.errors.message, 'test must be equal to 12');

    error = await t.throwsAsync(async () => {
        await acr
            .number()
            .equal(12, 'foobar')
            .validate(16);
    });
    t.is(error.errors.message, 'foobar');
});

test('max', async t => {
    const value = await acr
        .number()
        .max(5)
        .validate(2);
    t.is(value, 2);

    let error = await t.throwsAsync(async () => {
        await acr
            .number('test')
            .max(5)
            .validate(8);
    });
    t.is(error.errors.message, 'test must be greater than or equal to 5');

    error = await t.throwsAsync(async () => {
        await acr
            .number()
            .max(5, 'foobar')
            .validate(8);
    });
    t.is(error.errors.message, 'foobar');
});

test('min', async t => {
    const value = await acr
        .number()
        .min(5)
        .validate(8);
    t.is(value, 8);

    let error = await t.throwsAsync(async () => {
        await acr
            .number('test')
            .min(5)
            .validate(2);
    });
    t.is(error.errors.message, 'test must be less than or equal to 5');

    error = await t.throwsAsync(async () => {
        await acr
            .number()
            .min(5, 'foobar')
            .validate(2);
    });
    t.is(error.errors.message, 'foobar');
});

test('positive', async t => {
    const value = await acr
        .number()
        .positive()
        .validate(8);
    t.is(value, 8);

    let error = await t.throwsAsync(async () => {
        await acr
            .number('test')
            .positive()
            .validate(-2);
    });
    t.is(error.errors.message, 'test must be a positive number');

    error = await t.throwsAsync(async () => {
        await acr
            .number()
            .positive('foobar')
            .validate(-2);
    });
    t.is(error.errors.message, 'foobar');
});

test('negative', async t => {
    const value = await acr
        .number()
        .negative()
        .validate(-2);
    t.is(value, -2);

    let error = await t.throwsAsync(async () => {
        await acr
            .number('test')
            .negative()
            .validate(8);
    });
    t.is(error.errors.message, 'test must be a negative number');

    error = await t.throwsAsync(async () => {
        await acr
            .number()
            .negative('foobar')
            .validate(8);
    });
    t.is(error.errors.message, 'foobar');
});

test('integer', async t => {
    const value = await acr
        .number()
        .integer()
        .validate(8);
    t.is(value, 8);

    let error = await t.throwsAsync(async () => {
        await acr
            .number('test')
            .integer()
            .validate(2.1);
    });
    t.is(error.errors.message, 'test must be an integer');

    error = await t.throwsAsync(async () => {
        await acr
            .number()
            .integer('foobar')
            .validate('1.2');
    });
    t.is(error.errors.message, 'foobar');
});
