# Jest JSON matchers

This library defines 3 new matchers to be used in Jest. Its goal is preveting too many invocations of `JSON.parse()` and `JSON.stringify()` during tests.

## New Matchers

### expect(something).toBeJSON()

It will pass if input is a string and it can be deserialized by `JSON.parse()`. For example:

```js
expect('{"hello":"world"}').toBeJSON() // It will pass
expect('<span>Test</span>').toBeJSON() // It will not pass
```

### expect(something).toEqualJSON(value)

It will pass if input is a valid JSON string and its deserialized value is equal to the value passed to the matcher. It compares based on [`toEqual()`](https://jestjs.io/docs/en/expect#toequalvalue) matcher. For example:

```js
expect('{"hello":"world"}').toEqualJSON({ hello: 'world' }) // It will pass
expect('{\n  "status": 400\n}').toEqualJSON({ status: 200 }) // It will not pass
```

### expect(something).toMatchJSON(object)

It will pass if input is a valid JSON string and its deserialized value contains the properties of the value passed to the matcher. It matches based on [`toMatchObject()`](https://jestjs.io/docs/en/expect#tomatchobjectobject) matcher. For example:

```js
expect('{"status":202,"body":null}').toMatchJSON({ status: 202 }) // It will pass
expect('{"day":14,"month":3}').toMatchJSON({month: 12})
```

### expect.jsonContaining(object)

It will pass if input is a valid JSON string and its deserialized value contains the properties of the value passed to the matcher. It behaves like [`expect.objectContaining()`](https://jestjs.io/docs/en/expect#expectobjectcontainingobject) matcher. For example:

```js
// It will pass
expect({
    body: '{"message":"This is JSON"}'
}).toEqual({
    body: expect.jsonContaining({ message: "This is JSON" })
})
// It will not pass
expect({
    status: 200
}).toEqual({
    body: expect.jsonContaining({ message: 'Not this one' })
})
```

Please note this matcher is different from the others because it is invoked from `expect`.

## How to use

In order to use these matchers, you have to add them after the Jest environment has been loaded. There are different ways to accomplish that.

### Add to setupFilesAfterEnv

If you are using Jest 24 or later, you can add this library to the list of modules that are loaded after the Jest environment is loaded with [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array). For example:

```js
module.exports = {
    // ... other configurations
    setupFilesAfterEnv: ['jest-json-matchers/register']
}
```

### Add to setupTestFrameworkScriptFile

If you are using an older version of Jest, you may load it as part of the test framework. The configuration [`setupTestFrameworkScriptFile`](https://jestjs.io/docs/en/23.x/configuration#setuptestframeworkscriptfile-string) allows you to add a script to be loaded after the Jest environment. For example:

```js
// jest.config.js
module.exports = {
    // ... other configurations
    setupTestFrameworkScriptFile: '<rootDir>/setupEnv.js'
}

// setupEnv.js
require('jest-json-matchers/register')
```

### Load it explicitly

You should also be able to load it explicitly from a test file. You have to require (or import) it from where it is being used.

```js
// example.test.js
require('jest-json-matchers/register')

it('should pass', () => {
    expect('').not.toBeJSON()
})
```

This will guarantee that matchers are not loaded for all test files.

### Load matcher individually

By requiring the main module, each matcher is exported individually, thus you are able to call [`expect.extend()`](https://jestjs.io/docs/en/expect#expectextendmatchers) and import only the matchers that are convenient to you.

```js
// anotherExample.test.js
const { toBeJSON } = require('jest-json-matchers')

expect.extend({ toBeJSON })

it('should pass', () => {
    expect('null').toBeJSON()
})
```

## License
[MIT](LICENSE)