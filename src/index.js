'use strict';

const assert = require('assert');
const { get, merge, indexOf, has } = require('lodash');
const Type = require('./type');
const Chain = require('./chain');
const ValidationError = require('./validation-error');

const loadRule = acr => {
    require('./rules/string')(acr);
    require('./rules/number')(acr);
};

class Acr {
    constructor(config) {
        this.config = merge(
            {
                lang: 'en',
                locales: {},
                chains: {},
                context: {},
                translate: (string, lang) => {
                    return get(this.loadLocale(lang), string, string);
                }
            },
            config
        );
        this.types = {};
        this.locales = {};

        loadRule(this);
    }

    isSupportLanguage(lang) {
        return indexOf(['en', 'zh-cn'], lang) > -1;
    }

    loadLocale(lang) {
        if (!this.locales[lang]) {
            if (this.isSupportLanguage(lang)) {
                this.locales[lang] = require(`./locales/${lang}`);
            }

            if (has(this, `config.locales.${lang}`)) {
                this.locales[lang] = merge(
                    {},
                    this.locales[lang],
                    get(this, `config.locales.${lang}`)
                );
            }
        }

        return this.locales[lang];
    }

    get lang() {
        return this.config.lang;
    }

    translate(string, lang) {
        return this.config.translate(string, lang || this.lang);
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
        assert.notStrictEqual(
            rules,
            undefined,
            'validate rules cannot be empty.'
        );

        const chains = Object.keys(merge({}, rules)).map(path => {
            return rules[path].mount(data, path);
        });

        const results = await Promise.all(chains.map(chain => chain.valid()));
        const errors = results
            .filter(result => result.result === false)
            .map(result => result.detail);

        if (errors.length > 0) {
            throw new ValidationError(errors);
        }

        const pures = await Promise.all(chains.map(chain => chain.value()));
        pures.forEach((pure, key) => {
            data[chains[key].path] = pure;
        });

        return data;
    }
}

module.exports = Acr;
