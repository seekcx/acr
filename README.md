# Acr

[![build status](https://img.shields.io/travis/seekcx/acr.svg)](https://travis-ci.org/seekcx/acr)
[![code coverage](https://img.shields.io/codecov/c/github/seekcx/acr.svg)](https://codecov.io/gh/seekcx/acr)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/seekcx/acr.svg)](LICENSE)

优雅、易扩展的异步验证组件。

在实现上借鉴了 [joi](https://github.com/hapijs/joi) 和 [yup](https://github.com/jquense/yup) 的 api 风格，重新设计底层实现，因此在有非常强的扩展性。

## 特性

-   全异步验证支持（并且没有 [yup](https://github.com/jquense/yup) 的执行顺序错乱问题）
-   高度可扩展 
-   链式操作（定义和使用）
-   国际化支持
-   Typescript 支持

## 安装

npm

```sh
npm install acr
```

yarn

```sh
yarn add acr
```

## 配置

传入配置并创建一个 `acr` 实例，接下来的一切都在这个实例上完成。

```js
const { Acr } = require('acr');

const acr = new Acr({
    locale: 'zh-cn',
    context: { app },
    translate: (string, locale) => {
        return 'hello';
    },
    chains: {
        string: {
            transform: String
        }
    }
});
```

[配置说明](https://seek.gitbook.io/acr/config)

## 使用

```js
// 定义规则
acr.type('test')
    .define('equal', value => value === 'abel')
    .define('max', (value, { params }) => {
        return value <= params[0];
    });

// 单个验证
await acr.test().equal().validate('abel');

// 验证多个
await acr.validate({
    name: 'abel',
    age: 18
}, {
    name: acr.test().equal(),
    age: acr.test().max(20)
});

// 验证失败处理
try {
    await acr.validate({
        name: 'abdl',
        age: 21
    }, {
        name: acr.test().equal(),
        age: acr.test().max(20)
    });
} catch (error) {
    console.log(error); // ValidationError
}
```

## 文档

[快速开始](https://seek.gitbook.io/acr/quick-start)

[配置说明](https://seek.gitbook.io/acr/config)

[详细文档](https://seek.gitbook.io/acr)

## 成员

| Name     | Website                |
| -------- | ---------------------- |
| **abel** | <https://abel.seek.cx> |

## License

[MIT](LICENSE) © [seekcx](https://abel.seek.cx)

## Contributors

| Name       | Website                |
| ---------- | ---------------------- |
| **seekcx** | <https://abel.seek.cx> |
