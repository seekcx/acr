'use strict';

const Validator = require('./validator');

class Type {
    constructor(name, options) {
        this.name = name;
        this.rules = [];
        this.options = Object.assign({}, options);

        this.define('required', (_, { data, path, params }) => {
            if (data[path] === undefined) {
                return params[0] ? params[0] : false;
            }
        });
    }

    get acr() {
        return this.options.acr;
    }

    define(name, rule, options) {
        this.rules.push(name);

        Object.defineProperty(this, name, {
            writable: true,
            value: (chain, ...args) => {
                return new Validator(
                    name,
                    rule,
                    Object.assign(
                        {
                            type: this,
                            chain,
                            params: args
                        },
                        options
                    )
                );
            }
        });

        return this;
    }
}

module.exports = Type;
