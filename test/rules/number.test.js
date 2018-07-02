const test = require('ava');
const Acr = require('../../src');
const Chain = require('../../src/chain');

let acr;
test.beforeEach(() => {
    acr = new Acr({ locale: 'en' });
});

test('equal', async t => {
    const chain = await acr
        .number()
        .equal(12)
        .validate(12);
    t.true(chain instanceof Chain);

    let promise = acr
        .number({ name: 'test' })
        .equal(12)
        .validate(16);

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be equal to 12');

    promise = acr
        .number()
        .equal(12, 'foobar')
        .validate(16);

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('max', async t => {
    const chain = await acr
        .number()
        .max(5)
        .validate(2);
    t.true(chain instanceof Chain);

    let promise = acr
        .number('test')
        .max(5)
        .validate(8);

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be greater than or equal to 5');

    promise = acr
        .number()
        .max(5, 'foobar')
        .validate(8);

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('min', async t => {
    const chain = await acr
        .number()
        .min(5)
        .validate(8);
    t.true(chain instanceof Chain);

    let promise = acr
        .number('test')
        .min(5)
        .validate(2);

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be less than or equal to 5');

    promise = acr
        .number()
        .min(5, 'foobar')
        .validate(2);

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});
