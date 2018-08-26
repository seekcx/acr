'use strict';

const assert = require('assert');
const { isFunction } = require('lodash');
const Chain = require('./chain');

class When {
    constructor() {
        this.conditions = [];
        this.otherChain = null;
    }

    when(path, expect, rule) {
        const is = isFunction(path);
        const target = is ? path : () => this.data[path] == expect;
        const chain = is ? expect : rule;

        assert.strictEqual(
            isFunction(chain),
            true,
            `the rule argument to the when method must be a function`
        );

        this.conditions.push({
            target,
            rule: is ? expect : rule
        });

        return this;
    }

    async rule(data, context) {
        this.data = data;

        for (let idx = 0; this.conditions.length > idx; idx++) {
            const condition = this.conditions[idx];
            const result = await condition.target(data, context);

            if (result) {
                const chain = condition.rule();

                assert.ok(
                    chain instanceof Chain,
                    'the rule of the when method must be a validation chain'
                );

                return chain;
            }
        }

        if (this.otherChain) {
            return this.otherChain();
        }
    }

    other(chain) {
        this.otherChain = chain;

        return this;
    }
}

module.exports = When;
