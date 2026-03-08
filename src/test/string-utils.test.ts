import * as assert from 'assert';
import {
    toLowerCase,
    toUpperCase,
    toUpperCaseFirst,
    toCapitalize,
    toTitleCase,
    toKebabCase,
    toSnakeCase,
    toCamelCase,
    toPascalCase,
} from '../lib';

suite('String Utils Test Suite', () => {
    suite('toLowerCase', () => {
        test('example', () => {
            assert.strictEqual(toLowerCase('HELLO WORLD'), 'hello world');
            assert.strictEqual(toLowerCase('HELLOWORLD'), 'helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toLowerCase(), '');
        });
    });

    suite('toUpperCase', () => {
        test('example', () => {
            assert.strictEqual(toUpperCase('hello world'), 'HELLO WORLD');
            assert.strictEqual(toUpperCase('helloworld'), 'HELLOWORLD');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toUpperCase(), '');
        });
    });

    suite('toUpperCaseFirst', () => {
        test('example', () => {
            assert.strictEqual(toUpperCaseFirst('hello world'), 'Hello world');
            assert.strictEqual(toUpperCaseFirst('helloworld'), 'Helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toUpperCaseFirst(), '');
        });
    });

    suite('toCapitalize', () => {
        test('example', () => {
            assert.strictEqual(toCapitalize('hello World'), 'Hello world');
            assert.strictEqual(toCapitalize('helloWorld'), 'Helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toCapitalize(), '');
        });
    });

    suite('toTitleCase', () => {
        test('example', () => {
            assert.strictEqual(toTitleCase('hello world'), 'Hello World');
            assert.strictEqual(toTitleCase('helloWorld'), 'Helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toTitleCase(), '');
        });
    });

    suite('toKebabCase', () => {
        test('example', () => {
            assert.strictEqual(toKebabCase('HelloWorld'), 'hello-world');
            assert.strictEqual(toKebabCase('Helloworld'), 'helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toKebabCase(), '');
        });

        test('should trim leading and trailing dashes', () => {
            assert.strictEqual(toKebabCase('-hello-'), 'hello');
        });
    });

    suite('toSnakeCase', () => {
        test('example', () => {
            assert.strictEqual(toSnakeCase('HelloWorld'), 'hello_world');
            assert.strictEqual(toSnakeCase('Helloworld'), 'helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toSnakeCase(), '');
        });

        test('should trim leading and trailing underscores', () => {
            assert.strictEqual(toSnakeCase('_hello_'), 'hello');
        });
    });

    suite('toCamelCase', () => {
        test('example', () => {
            assert.strictEqual(toCamelCase('hello-world'), 'helloWorld');
            assert.strictEqual(toCamelCase('Helloworld'), 'helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toCamelCase(), '');
        });
    });

    suite('toPascalCase', () => {
        test('example', () => {
            assert.strictEqual(toPascalCase('hello-world'), 'HelloWorld');
            assert.strictEqual(toPascalCase('helloworld'), 'Helloworld');
        });

        test('should handle default parameter', () => {
            assert.strictEqual(toPascalCase(), '');
        });
    });
});
