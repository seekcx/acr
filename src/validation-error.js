'use strict';

class ValidationError extends Error {
    constructor(errors) {
        super('Validation failed');
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

module.exports = ValidationError;
