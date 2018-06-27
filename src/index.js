'use strict';

const assert = require('assert');
const { get } = require('lodash');
const Type = require('./type');
const Chain = require('./chain');
const ValidationError = require('./validation-error');

const locales = Object.create(null);
const loadLocale = locale => {
    if (!locales[locale]) {
        locales[locale] = require(`./locales/${locale}`);
    }

    return locales[locale];
};

const loadRule = acr => {
    require('./rules/string')(acr);
};

class Acr {
    constructor(config) {
        this.config = Object.assign(
            {
                locale: 'en',
                chains: {}
            },
            config
        );
        this.types = Object.create(null);

        loadRule(this);
    }

    get locale() {
        return this.config.locale;
    }

    translate(string, locale) {
        const locales = loadLocale(locale || this.locale);
        return get(locales, string, string);
    }

    type(name, options) {
        const { types } = this;

        if (types[name] === undefined) {
            types[name] = new Type(name, Object.assign({ acr: this }, options));

            Object.defineProperty(this, name, {
                value: params => {
                    params =
                        typeof params === 'string' ? { name: params } : params;

                    return new Chain(
                        types[name],
                        Object.assign({}, this.config.chains[name], params)
                    );
                }
            });
        }

        return types[name];
    }

    async validate(data, rules) {
        assert.notEqual(rules, undefined, 'validate rules cannot be empty.');

        const chains = Object.keys(Object.assign({}, rules)).map(path =>
            rules[path].mount(data, path)
        );

        const results = await Promise.all(chains.map(chain => chain.valid()));
        const errors = results
            .filter(result => result.result === false)
            .map(result => result.detail);

        if (errors.length > 0) {
            throw new ValidationError(errors);
        }

        const pures = await Promise.all(chains.map(chain => chain.transform()));
        pures.forEach((pure, key) => {
            data[chains[key].path] = pure;
        });

        return data;
    }
}

module.exports = Acr;
