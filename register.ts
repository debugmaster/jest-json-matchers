/**
 * Add all JSON methods to Jest matchers
 */

type GlobalExpect = NodeJS.Global & { expect: jest.Expect }

if (!(global as GlobalExpect).expect) {
    throw new Error('jest-json-matchers should be loaded after Jest environment')
}

expect.extend(require('.'))