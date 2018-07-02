'use strict';

const assert = require('assert');
const { get, merge, lowerCase } = require('lodash');
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
    require('./rules/number')(acr);
};

class Acr {
    constructor(config) {
        this.config = merge(
            {
                locale: 'en',
                chains: {},
                context: {},
                translate: (string, locale) =>
                    get(loadLocale(locale), string, string)
            },
            config
        );
        this.types = Object.create(null);

        loadRule(this);
    }

    get locale() {
        return lowerCase(this.config.locale);
    }

    translate(string, locale) {
        return this.config.translate(string, locale || this.locale);
    }

    type(name, options) {
        const { types } = this;

        if (types[name] === undefined) {
            types[name] = new Type(name, merge({ acr: this }, options));

            Object.defineProperty(this, name, {
                value: params => {
                    params =
                        typeof params === 'string' ? { name: params } : params;

                    return new Chain(
                        types[name],
                        merge({}, this.config.chains[name], params)
                    );
                }
            });
        }

        return types[name];
    }

    async validate(data, rules) {
        assert.notEqual(rules, undefined, 'validate rules cannot be empty.');

        const chains = Object.keys(merge({}, rules)).map(path =>
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
