'use strict';

const assert = require('assert');
const { indexOf, isArray } = require('lodash');

module.exports = acr => {
    const string = acr.type('string');

    string.define('equal', (value, { params, identity }) => {
        assert.notStrictEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return String(value) === params[0] ? true : params[1] || false;
    });

    string.define('max', (value, { params, identity }) => {
        assert.notStrictEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return String(value).length > params[0] ? params[1] || false : true;
    });

    string.define('min', (value, { params, identity }) => {
        assert.notStrictEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return String(value).length < params[0] ? params[1] || false : true;
    });

    string.define('length', (value, { params, identity }) => {
        assert.notStrictEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return String(value).length === params[0] ? true : params[1] || false;
    });

    string.define('email', (value, { params }) => {
        const result = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(
            value
        );

        return result === false ? params[0] || false : true;
    });

    string.define('regex', (value, { params, identity }) => {
        assert.strictEqual(
            params[0] instanceof RegExp,
            true,
            `'${identity}' first parameter must be a RegExp type.`
        );

        return params[0].test(value) === false ? params[1] || false : true;
    });

    string.define('in', (value, { params, identity }) => {
        assert.strictEqual(
            isArray(params[0]),
            true,
            `'${identity}' first parameter must be an Array type.`
        );

        return indexOf(params[0], String(value)) === -1
            ? params[1] || false
            : true;
    });

    string.define('objectId', (value, { params }) => {
        return /^[a-f0-9]{24}$/.test(value) ? true : params[0] || false;
    });

    const notBase64 = /[^A-Z0-9+/=]/i;
    string.define('base64', (value, { params }) => {
        const string = String(value);
        const { length } = string;
        if (!length || length % 4 !== 0 || notBase64.test(value)) {
            return params[0] || false;
        }

        const postion = string.indexOf('=');
        return postion === -1 ||
            postion === length - 1 ||
            (postion === length - 2 && string[length - 1] === '=')
            ? true
            : params[0] || false;
    });

    string.define('url', (value, { params }) => {
        const result = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
            value
        );

        return result ? true : params[0] || false;
    });

    const uuid = {
        3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    };
    string.define('uuid', (value, { params, identity }) => {
        const pattern = uuid[params[0] || 'all'];

        assert.strictEqual(
            pattern instanceof RegExp,
            true,
            `'${identity}' first parameter must be 3, 4, 5 or "all"`
        );

        return pattern.test(value) ? true : params[1] || false;
    });
};
