declare namespace Acr {
    interface Context {
        data: any;
        path: string;
        context: any;
        identity: string;
        params: any[];
    }

    interface Config {
        lang?: string;
        locales?: {
            [x: string]: any;
        };
        context?: any;
        translate?(string: string, locale?: string): string
        chains?: {
            [x: string]: {
                name?: string;
                transform?(value: any): any;
            }
        },
    }

    interface Detail {
        path: string;
        identity: string;
        message: string;
    }

    export class ValidationError extends Error {
        constructor(errors: Detail | Detail[]);
        errors: Detail | Detail[];
    }

    type Rule = (value: any, context: Context) => Promise<any> | any;

    class Validator {
        constructor(name: string, rule: Rule, options?: any);
        acr: Acr;
        identity: string;
        data: {
            name: string;
            path: string;
            params: any[];
        }
        message: string;
        validate(value: any, data: any, path: string): Promise<boolean>;
    }

    class Type {
        constructor(name: string, options?: any);
        acr: Acr;
        define(name: string, rule: Rule, options?: any): this;
        required(message?: string): Validator;
    }

    interface ChainOptions {
        name?: string;
        transform?: (value: any) => string;
    }

    class Result {
        constructor(result: boolean, context: any);
        detail: Detail;
        path: string;
        identity: string;
        message: string;
    }

    class Chain {
        validate(value: any): Promise<this>;
        transform(fn: (value: any) => Promise<any> | any): Promise<any>;
        required(message?: string): this;
        default(value: any): this;
        default(value: (data: any, context: any) => any): this;
    }

    export class StringType extends Chain {
        equal(value: string, message?: string): this;
        max(value: number, message?: string): this;
        min(value: number, message?: string): this;
        length(value: number, message?: string): this;
        email(message?: string): this;
        regex(regex: RegExp, message?: string): this;
        in(array: any[], message?: string): this;
        objectId(message?: string): this;
        base64(message?: string): this;
        url(message?: string): this;
        uuid(message?: string): this;
    }

    export class NumberType extends Chain {
        equal(value: number, message?: string): this;
        max(value: number, message?: string): this;
        min(value: number, message?: string): this;
        positive(message?: string): this;
        negative(message?: string): this;
        integer(message?: string): this;
    }

    class When {
        when(path: string, expect: any, rule: () => Chain): this;
        when(expected: (data: any, context: any) => Promise<boolean> | boolean, rule: () => Chain): this;
        other(chain: () => Chain): this;
    }

    class Acr {
        constructor(config?: Acr.Config);
        locale: string;
        when(path: string, expect: any, rule: () => Chain): When;
        when(expected: (data: any, context: any) => Promise<boolean> | boolean, rule: () => Chain): When;
        translate(string: string, locale?: string): string;
        type(name: string, options?: any): Acr.Type;
        validate(data: any, rules: any);
        string(name: string): Acr.StringType;
        string(options?: Acr.ChainOptions): Acr.StringType;
        number(name: string): Acr.NumberType;
        number(options?: Acr.ChainOptions): Acr.NumberType;
    }
}

declare interface Acr extends Acr.Acr {}

export = Acr;
