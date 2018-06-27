'use strict';

class Result {
    constructor(result, context) {
        this.result = result;
        this.context = context;
    }

    get detail() {
        return {
            path: this.path,
            identity: this.identity,
            message: this.message
        };
    }

    get path() {
        return this.context.path;
    }

    get identity() {
        return this.context.validator.identity;
    }

    get message() {
        return this.context.validator.message;
    }
}

module.exports = Result;
