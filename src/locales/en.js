'use strict';

module.exports = {
    string: {
        required: '{name || path} is a required field',
        equal: '{name || path} must be equal to {params[0]}',
        max: '{name || path} must be at most {params[0]} characters',
        min: '{name || path} must be at least {params[0]} characters',
        length: '{name || path} must be at exactly {params[0]} characters',
        email: '{name || path} must be a valid email',
        regex: '{name || path} must match the following: "{params[0]}"',
        in: '{name || path} must be in [ {params[0].join(", ")} ]',
        objectId: '{name || path} must be a MongoDB ObjectID',
        base64: '{name || path} must be a base64 string',
        url: '{name || path} must be a url',
        uuid: '{name || path} must be a uuid'
    },
    number: {
        required: '{name || path} is a required field',
        equal: '{name || path} must be equal to {params[0]}',
        max: '{name || path} must be greater than or equal to {params[0]}',
        min: '{name || path} must be less than or equal to {params[0]}',
        positive: '{name || path} must be a positive number',
        negative: '{name || path} must be a negative number',
        integer: '{name || path} must be an integer'
    }
};
