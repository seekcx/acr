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

test('min', async t => {
    const chain = await acr
        .string()
        .min(5)
        .validate('foobar');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .min(5)
        .validate('foo');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be at least 5 characters');

    promise = acr
        .string()
        .min(5, 'foobar')
        .validate('foo');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('length', async t => {
    const chain = await acr
        .string()
        .length(5)
        .validate('fooba');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .length(5)
        .validate('foo');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be at exactly 5 characters');

    promise = acr
        .string()
        .length(5, 'foobar')
        .validate('foo');

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

test('regex', async t => {
    const chain = await acr
        .string()
        .regex(/abel/)
        .validate('abel');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .regex(/foobar/)
        .validate('abel');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must match the following: "/foobar/"');

    promise = acr
        .string()
        .regex(/foobar/, 'foobar')
        .validate('abel');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('in', async t => {
    const chain = await acr
        .string()
        .in(['foo', 'bar'])
        .validate('foo');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .in(['foo', 'bar'])
        .validate('bax');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be in [ foo, bar ]');

    promise = acr
        .string()
        .in(['foo', 'bar'], 'foobar')
        .validate('bax');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('objectId', async t => {
    const chain = await acr
        .string()
        .objectId()
        .validate('5b2b5a1bcc6f21584075edc9');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .objectId()
        .validate('foobar');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be a MongoDB ObjectID');

    promise = acr
        .string()
        .objectId('foobar')
        .validate('bax');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('base64', async t => {
    const chain = await acr
        .string()
        .base64()
        .validate('MTIzNA==');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .base64()
        .validate('MTIzNA');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be a base64 string');

    promise = acr
        .string()
        .base64('foobar')
        .validate('MTIzN==A');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');

    promise = acr
        .string('test')
        .base64()
        .validate('MTIzN==A');

    error = await t.throws(promise);
    t.is(error.errors.message, 'test must be a base64 string');
});

test('url', async t => {
    const chain = await acr
        .string()
        .url()
        .validate('https://seek.cx');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .url()
        .validate('bax');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be a url');

    promise = acr
        .string()
        .url('foobar')
        .validate('bax');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});

test('uuid', async t => {
    const chain = await acr
        .string()
        .uuid(4)
        .validate('b9a98908-436b-4481-9814-a0dd03ff1698');
    t.true(chain instanceof Chain);

    let promise = acr
        .string('test')
        .uuid()
        .validate('bax');

    let error = await t.throws(promise);
    t.is(error.errors.message, 'test must be a uuid');

    promise = acr
        .string()
        .uuid('all', 'foobar')
        .validate('bax');

    error = await t.throws(promise);
    t.is(error.errors.message, 'foobar');
});
