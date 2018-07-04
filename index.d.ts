declare namespace Acr {
    declare interface Context {
        data: any;
        path: string;
        identity: string;
        params: any[];
    }

    declare interface Config {
        locale?: string;
        context?: any;
        translate?(string: string, locale?: string): string
        chains?: {
            [string]: {
                transform(value: any): any;
            }
        },
    }

    declare interface Detail {
        path: string;
        identity: string;
        message: string;
    }

    export class ValidationError extends Error {
        constructor(errors: Detail | Detail[]);
        errors: Detail | Detail[];
    }

    type RuleResult = ?(boolean | string);
    declare function Rule(value: any, context: Context): RuleResult;

    declare class Validator {
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

    declare class Type {
        constructor(name: string, options?: any);
        acr: Acr;
        define(name: string, rule: Rule, options?: any);
        required(message?: string): Validator;
    }

    declare interface ChainOptions {
        name?: string;
        transform?: (value: any) => string;
    }

    declare class Result {
        constructor(result: boolean, context: any);
        detail: Detail;
        path: string;
        identity: string;
        message: string;
    }

    declare class Chain {
        validate(value: any): Promise<this>;
        transform(): Promise<any>;
        required(message?: string): this;
    }

    export class StringType extends Chain {
        equal(value: string, message?: string): this;
        max(value: number, message?: string): this;
        min(value: number, message?: string): this;
        length(value: number, message?: string): this;
        email(message?: string): this;
        regex(regex: RegExp, message?: string): this;
        in(array: any[], message?: stirng): this;
        objectId(message?: string): this;
        base64(message?: string): this;
        url(message?: string): this;
        uuid(message?: string): this;
    }

    export class NumberType extends Chain {
        equal(value: number, message?: string): this;
        max(value: number, message?: string): this;
        min(value: number, message?: string): this;
    }
}

declare class Acr {
    constructor(config?: Config);
    locale: string;
    translate(string: string, locale?: string): string;
    type(name: string, options?: any): Acr.Type;
    validate(data: any, rules: any);
    string(name: string): Acr.StringType;
    string(options?: ChainOptions): Acr.StringType;
    number(name: string): Acr.NumberType;
    number(options?: ChainOptions): Acr.NumberType;
}

export = Acr;
