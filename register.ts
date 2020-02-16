/**
 * Add all JSON methods to Jest matchers
 */

if (!expect) {
    throw new Error('It should be loaded in Jest')
}

expect.extend(require('.'))