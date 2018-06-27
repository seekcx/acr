const test = require('ava');
const Acr = require('../../src');
const Chain = require('../../src/chain');

let acr;
test.beforeEach(() => {
    acr = new Acr({ locale: 'en' });
});

test('equal', async t => {
    const chain = await acr
        .string()
        .equal('foo')
        .validate('foo');
    t.true(chain instanceof Chain);

    let promise = acr
        .string({ name: 'test' })
        .equal('foo')
        .validate('bar');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be equal to foo');

    promise = acr
        .string()
        .equal('foo', 'foobar')
        .validate('bar');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('max', async t => {
    const chain = await acr
        .string()
        .max(5)
        .validate('foo');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .max(5)
        .validate('foobar');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be at most 5 characters');

    promise = acr
        .string()
        .max(5, 'foobar')
        .validate('foobar');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('email', async t => {
    const chain = await acr
        .string()
        .email()
        .validate('abel@seek.cx');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .email()
        .validate('foobar');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be a valid email');

    promise = acr
        .string()
        .email('foobar')
        .validate('foobar');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});
