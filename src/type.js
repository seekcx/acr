'use strict';

const Validator = require('./validator');

class Type {
    constructor(name, options) {
        this.name = name;
        this.rules = [];
        this.options = { ...options };
    }

    get acr() {
        return this.options.acr;
    }

    define(name, rule, options) {
        this.rules.push(name);

        Object.defineProperty(this, name, {
            writable: true,
            value: (chain, ...args) => {
                return new Validator(name, rule, {
                    type: this,
                    chain,
                    params: args,
                    ...options
                });
            }
        });

        return this;
    }
}

module.exports = Type;
