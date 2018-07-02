'use strict';

const assert = require('assert');

module.exports = acr => {
    const number = acr.type('number');

    number.define('equal', (value, { params, identity }) => {
        assert.notEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return Number(value) === Number(params[0]) ? true : params[1] || false;
    });

    number.define('max', (value, { params, identity }) => {
        assert.notEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return Number(value) > params[0] ? params[1] || false : true;
    });

    number.define('min', (value, { params, identity }) => {
        assert.notEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return Number(value) < params[0] ? params[1] || false : true;
    });
};
