'use strict';

const assert = require('assert');
const { isInteger } = require('lodash');

module.exports = acr => {
    const number = acr.type('number');

    number.define('equal', (value, { params, identity }) => {
        assert.notStrictEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return Number(value) === Number(params[0]) ? true : params[1] || false;
    });

    number.define('max', (value, { params, identity }) => {
        assert.notStrictEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return Number(value) > params[0] ? params[1] || false : true;
    });

    number.define('min', (value, { params, identity }) => {
        assert.notStrictEqual(
            params[0],
            undefined,
            `'${identity}' first parameter must be provided.`
        );

        return Number(value) < params[0] ? params[1] || false : true;
    });

    number.define('positive', (value, { params }) => {
        return Number(value) > 0 ? true : params[0] || false;
    });

    number.define('negative', (value, { params }) => {
        return Number(value) < 0 ? true : params[0] || false;
    });

    number.define('integer', (value, { params }) => {
        return isInteger(Number(value)) ? true : params[0] || false;
    });
};
