const test = require('ava');
const Acr = require('../../src');

let acr;
test.beforeEach(() => {
    acr = new Acr({ locale: 'en' });
});

test('equal', async t => {
    const value = await acr
        .string()
        .equal('foo')
        .validate('foo');
    t.is(value, 'foo');

    let error = await t.throwsAsync(async () => {
        await acr
            .string({ name: 'test' })
            .equal('foo')
            .validate('bar');
    });
    t.is(error.errors.message, 'test must be equal to foo');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .equal('foo', 'foobar')
            .validate('bar');
    });
    t.is(error.errors.message, 'foobar');
});

test('max', async t => {
    const value = await acr
        .string()
        .max(5)
        .validate('foo');
    t.is(value, 'foo');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .max(5)
            .validate('foobar');
    });
    t.is(error.errors.message, 'test must be at most 5 characters');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .max(5, 'foobar')
            .validate('foobar');
    });
    t.is(error.errors.message, 'foobar');
});

test('min', async t => {
    const value = await acr
        .string()
        .min(5)
        .validate('foobar');
    t.is(value, 'foobar');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .min(5)
            .validate('foo');
    });
    t.is(error.errors.message, 'test must be at least 5 characters');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .min(5, 'foobar')
            .validate('foo');
    });
    t.is(error.errors.message, 'foobar');
});

test('length', async t => {
    const value = await acr
        .string()
        .length(5)
        .validate('fooba');
    t.is(value, 'fooba');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .length(5)
            .validate('foo');
    });
    t.is(error.errors.message, 'test must be at exactly 5 characters');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .length(5, 'foobar')
            .validate('foobar');
    });
    t.is(error.errors.message, 'foobar');
});

test('email', async t => {
    const value = await acr
        .string()
        .email()
        .validate('abel@seek.cx');
    t.is(value, 'abel@seek.cx');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .email()
            .validate('foobar');
    });
    t.is(error.errors.message, 'test must be a valid email');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .email('foobar')
            .validate('foobar');
    });
    t.is(error.errors.message, 'foobar');
});

test('regex', async t => {
    const value = await acr
        .string()
        .regex(/abel/)
        .validate('abel');
    t.is(value, 'abel');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .regex(/foobar/)
            .validate('abel');
    });
    t.is(error.errors.message, 'test must match the following: "/foobar/"');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .regex(/foobar/, 'foobar')
            .validate('abel');
    });
    t.is(error.errors.message, 'foobar');
});

test('in', async t => {
    const value = await acr
        .string()
        .in(['foo', 'bar'])
        .validate('foo');
    t.is(value, 'foo');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .in(['foo', 'bar'])
            .validate('bax');
    });
    t.is(error.errors.message, 'test must be in [ foo, bar ]');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .in(['foo', 'bar'], 'foobar')
            .validate('bax');
    });
    t.is(error.errors.message, 'foobar');
});

test('objectId', async t => {
    const value = await acr
        .string()
        .objectId()
        .validate('5b2b5a1bcc6f21584075edc9');
    t.is(value, '5b2b5a1bcc6f21584075edc9');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .objectId()
            .validate('foobar');
    });
    t.is(error.errors.message, 'test must be a MongoDB ObjectID');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .objectId('foobar')
            .validate('bax');
    });
    t.is(error.errors.message, 'foobar');
});

test('base64', async t => {
    const value = await acr
        .string()
        .base64()
        .validate('MTIzNA==');
    t.is(value, 'MTIzNA==');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .base64()
            .validate('MTIzNA');
    });
    t.is(error.errors.message, 'test must be a base64 string');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .base64('foobar')
            .validate('MTIzN==A');
    });
    t.is(error.errors.message, 'foobar');

    error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .base64()
            .validate('MTIzN==A');
    });
    t.is(error.errors.message, 'test must be a base64 string');
});

test('url', async t => {
    const value = await acr
        .string()
        .url()
        .validate('https://seek.cx');
    t.is(value, 'https://seek.cx');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .url()
            .validate('bax');
    });
    t.is(error.errors.message, 'test must be a url');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .url('foobar')
            .validate('bax');
    });
    t.is(error.errors.message, 'foobar');
});

test('uuid', async t => {
    const value = await acr
        .string()
        .uuid(4)
        .validate('b9a98908-436b-4481-9814-a0dd03ff1698');
    t.is(value, 'b9a98908-436b-4481-9814-a0dd03ff1698');

    let error = await t.throwsAsync(async () => {
        await acr
            .string('test')
            .uuid()
            .validate('bax');
    });
    t.is(error.errors.message, 'test must be a uuid');

    error = await t.throwsAsync(async () => {
        await acr
            .string()
            .uuid('all', 'foobar')
            .validate('bax');
    });
    t.is(error.errors.message, 'foobar');
});
