'use strict';

/* eslint-disable no-await-in-loop */
const { isNil, get, set } = require('lodash');
const Result = require('./result');
const ValidationError = require('./validation-error');

class Chain {
    constructor(type, params) {
        this.type = type;
        this.validator = [];

        this.setup(params);
    }

    setup(params) {
        const { type } = this;
        this.params = params;
        const props = Object.create(null);

        type.rules.forEach(rule => {
            props[rule] = {
                value: (...args) => {
                    const validate = type[rule](this, ...args);
                    this.validator.push(validate);

                    return this;
                }
            };
        });

        return Object.defineProperties(this, props);
    }

    get value() {
        return this.data[this.path];
    }

    mount(data, path) {
        this.data = data;
        this.path = path;

        return this;
    }

    async valid() {
        const { path, data } = this;
        const context = {
            path,
            data
        };

        for (let key = 0; key < this.validator.length; key++) {
            const validator = this.validator[key];

            const result = await validator.validate(data[path], data, path);

            if (result === false) {
                return new Result(
                    false,
                    Object.assign(context, {
                        validator
                    })
                );
            }
        }

        return new Result(true, context);
    }

    async validate(value) {
        const result = await this.mount({ candy: value }, 'candy').valid();

        if (result.result === false) {
            throw new ValidationError(result.detail);
        }

        return this;
    }

    async trans() {
        const fn = get(this.params, 'transform');
        return isNil(fn) ? this.value : fn(this.value);
    }

    transform(fn) {
        set(this.params, 'transform', fn);

        return this;
    }
}

module.exports = Chain;
