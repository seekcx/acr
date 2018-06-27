'use strict';

const assert = require('assert');

module.exports = acr => {
    const string = acr.type('string');

    string.define('equal', (value, { params, identity }) => {
        assert.notEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return String(value) === params[0] ? true : params[1] || false;
    });

    string.define('max', (value, { params, identity }) => {
        assert.notEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return String(value).length > params[0] ? params[1] || false : true;
    });

    string.define('email', (value, { params }) => {
        const result = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(
            value
        );

        return result === false ? params[0] || false : true;
    });
};
