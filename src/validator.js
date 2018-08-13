'use strict';

const { isNil } = require('lodash');
const { template } = require('lodash');

class Validator {
    constructor(name, rule, options) {
        this.options = { name, ...options, rule };
    }

    get acr() {
        return this.options.type.acr;
    }

    get identity() {
        const { options } = this;
        return options.id || options.type.name + '.' + options.name;
    }

    get data() {
        return {
            name: this.options.chain.params.name,
            path: this.context.path,
            params: this.options.params
        };
    }

    get message() {
        const { _message, identity, data, acr } = this;

        const render = template(acr.translate(_message || identity), {
            escape: /\{(.+?)\}/g
        });

        return render(data);
    }

    set message(message) {
        this._message = message;
    }

    async validate(value, data, path) {
        const { options } = this;
        this.context = {
            data,
            path,
            context: this.acr.config.context,
            identity: this.identity,
            params: options.params
        };

        const result = await options.rule(value, this.context);

        const type = typeof result;
        if (type === 'string') {
            this.message = result;
            return false;
        }

        if (type === 'boolean') {
            return result !== false;
        }

        return isNil(result);
    }
}

module.exports = Validator;
