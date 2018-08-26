# Acr

[![NPM version](https://img.shields.io/npm/v/acr.svg?style=flat-square)](https://npmjs.org/package/acr)
[![build status](https://img.shields.io/travis/seekcx/acr.svg?style=flat-square)](https://travis-ci.org/seekcx/acr)
[![code coverage](https://img.shields.io/codecov/c/github/seekcx/acr.svg?style=flat-square)](https://codecov.io/gh/seekcx/acr)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/seekcx/acr.svg?style=flat-square)](LICENSE)

优雅、易扩展的异步验证组件。

在实现上借鉴了 [joi](https://github.com/hapijs/joi) 和 [yup](https://github.com/jquense/yup) 的 api 风格，重新设计底层实现，具有非常强的扩展性。

## 特性

-   全异步验证支持
-   高度可扩展
-   链式操作（定义和使用）
-   国际化支持
-   Typescript 支持
-   参数命名
-   数据转换
-   默认值 #2
-   逻辑验证 #3

## 安装

npm

```sh
npm install acr
```

yarn

```sh
yarn add acr
```

## 使用

```js
// 验证多个
const { name, age, gender } = await acr.validate({
    name: 'abel',
    age: 18,
    gender: ''
}, {
    name: acr.string().equal('abel'),
    age: acr.number().min(16).max(20),
    gender: acr.string().in(['male', 'female']).default('male')
});

console.log(name, age, gender); // abel 18 male

// 条件验证
await acr.validate({
    name: 'abel',
    age: 18,
    gender: 'male'
}, {
    // 当 name 等于 abel 时，验证 age 是否在 16-20 之间
    age: acr.when('name', 'abel', () => {
        return acr.number().min(16).max(20);
    }),
    // 当闭包返回 true 时，验证 gender 必须等于 male
    gender: acr.when(data => {
        return data['name'] === 'abel';
    }, () => {
        return acr.string().equal('male');
    })
});


// 验证失败处理
try {
    await acr.validate({
        name: 'abel',
    }, {
        name: acr.string().equal('zbel'),
    });
} catch (error) {
    console.log(error); // ValidationError
}
```

## 配置

传入配置并创建一个 `acr` 实例，接下来的一切都在这个实例上完成。

```js
const Acr = require('acr');

const acr = new Acr({
    lang: 'zh-cn',
    chains: {
        string: {
            transform: String
        }
    }
});
```

## 文档

[快速开始](https://seek.gitbook.io/acr/quick-start)

[配置说明](https://seek.gitbook.io/acr/config)

[详细文档](https://seek.gitbook.io/acr)

## 相关

[egg-acr](https://github.com/seekcx/egg-acr)：基于 acr 实现的 eggjs 版本的异步验证插件。

## 成员

| Name     | Website                |
| -------- | ---------------------- |
| **abel** | <https://abel.seek.cx> |

## License

[MIT](LICENSE) © [seekcx](https://abel.seek.cx)
