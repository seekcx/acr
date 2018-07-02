'use strict';

module.exports = {
    string: {
        required: '{name || path}必填',
        equal: '{name || path}必须等于{params[0]}',
        max: '{name || path}不能超过 {params[0]} 个字符',
        min: '{name || path}不能少于 {params[0]} 个字符',
        length: '{name || path}必须等于 {params[0]} 个字符',
        email: '{name || path}应该是一个有效的邮箱',
        regex: '{name || path}必须匹配 "{params[0]}"',
        in: '{name || path}必须在 [ {params[0].join(", ")} ] 中',
        objectId: '{name || path}必须是 MongoDB 的 ObjectID',
        base64: '{name || path}必须是一个 base64 字符串',
        url: '{name || path}必须是一个 URL',
        uuid: '{name || path}必须是一个 UUID'
    },
    number: {
        required: '{name || path}必填',
        equal: '{name || path}必须等于 {params[0]}',
        max: '{name || path}不能大于 {params[0]}',
        min: '{name || path}不能小于 {params[0]}'
    }
};
