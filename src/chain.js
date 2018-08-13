'use strict';

/* eslint-disable no-await-in-loop */
const { isNil, get, set } = require('lodash');
const Result = require('./result');
const Validator = require('./validator');
const ValidationError = require('./validation-error');

class Chain {
    constructor(type, params) {
        this.type = type;
        this.isRequired = false;
        this.requiredMessage = null;
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

    required(message) {
        this.isRequired = true;
        this.requiredMessage = message;

        return this;
    }

    get value() {
        return this.data[this.path];
    }

    mount(data, path) {
        this.data = data;
        this.path = path;

        return this;
    }

    async validateRequired(data, path) {
        if (this.isRequired === false) {
            return new Result(true, this.context);
        }

        const validator = new Validator(
            'required',
            (_, { data, path, params }) => {
                if (data[path] === undefined || data[path] === '') {
                    return params[0] ? params[0] : false;
                }
            },
            {
                type: this.type,
                chain: this,
                params: [this.requiredMessage]
            }
        );

        const result = await validator.validate(data[path], data, path);

        return new Result(
            result !== false,
            Object.assign(this.context, {
                validator
            })
        );
    }

    get context() {
        const { path, data } = this;

        return {
            path,
            data
        };
    }

    async valid() {
        const { path, data } = this;

        const result = await this.validateRequired(data, path);
        if (result.result === false) {
            return result;
        }

        if (
            this.isRequired === false &&
            (data[path] === undefined || data[path] === '')
        ) {
            return new Result(true, this.context);
        }

        for (let key = 0; key < this.validator.length; key++) {
            const validator = this.validator[key];
            const result = await validator.validate(data[path], data, path);

            if (result === false) {
                return new Result(
                    false,
                    Object.assign(this.context, {
                        validator
                    })
                );
            }
        }

        return new Result(true, this.context);
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
