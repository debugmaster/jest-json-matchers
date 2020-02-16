import { MatcherState, SyncExpectationResult } from 'expect/build/types'
import { toBeJSON, toEqualJSON, toMatchJSON } from '.'

const mockedState = {
    utils: {
        printReceived: JSON.stringify,
        EXPECTED_COLOR: (r: string) => r
    } as Partial<MatcherState["utils"]> as MatcherState["utils"]
} as Partial<MatcherState> as MatcherState

describe('toBeJSON()', () => {

    it('should pass for serialized null', () => {
        expect(
            toBeJSON.call(mockedState, JSON.stringify(null))
        ).toMatchObject({
            pass: true
        })
    })

    it('should pass for serialized number', () => {
        expect(
            toBeJSON.call(mockedState, JSON.stringify(42))
        ).toMatchObject({
            pass: true
        })
    })

    it('should pass for serialized string', () => {
        expect(
            toBeJSON.call(mockedState, JSON.stringify('test'))
        ).toMatchObject({
            pass: true
        })
    })

    it('should pass for serialized array', () => {
        expect(
            toBeJSON.call(mockedState, JSON.stringify(['apple', 'banana']))
        ).toMatchObject({
            pass: true
        })
    })

    it('should pass for serialized object', () => {
        expect(
            toBeJSON.call(mockedState, JSON.stringify({ test: true }))
        ).toMatchObject({
            pass: true
        })
    })

    it('should pass for formatted strings', () => {
        expect(
            toBeJSON.call(mockedState, JSON.stringify({ test: true }, null, 4))
        ).toMatchObject({
            pass: true
        })
    })

    it('should not pass for undefined', () => {
        expect(
            toBeJSON.call(mockedState, undefined)
        ).toMatchObject({
            pass: false
        })
    })

    it('should not pass for null', () => {
        expect(
            toBeJSON.call(mockedState, null)
        ).toMatchObject({
            pass: false
        })
    })

    it('should not pass for numbers', () => {
        expect(
            toBeJSON.call(mockedState, 42)
        ).toMatchObject({
            pass: false
        })
    })

    it("should not pass for strings that aren't JSON strings", () => {
        expect(
            toBeJSON.call(mockedState, 'test')
        ).toMatchObject({
            pass: false
        })
    })

    it('should not pass for arrays', () => {
        expect(
            toBeJSON.call(mockedState, ['apple', 'banana'])
        ).toMatchObject({
            pass: false
        })
    })

    it('should not pass for object', () => {
        expect(
            toBeJSON.call(mockedState, { test: true })
        ).toMatchObject({
            pass: false
        })
    })

    it('should return negated message', () => {
        const match = toBeJSON.call(mockedState, JSON.stringify(null));
        expect(
            match.message()
        ).toBe('expected "null" not to be JSON, but it is a JSON string')
    })

    it('should return error message', () => {
        const match = toBeJSON.call(mockedState, null);
        expect(
            match.message()
        ).toBe('expected null to be JSON, but it is not a JSON string')
    })

    it('should return invalid JSON message', () => {
        const match = toBeJSON.call(mockedState, 'test');
        expect(
            match.message()
        ).toBe('expected "test" to be JSON, but it is not a valid JSON string')
    })
})

describe('toEqualJSON()', () => {

    it('should pass for deserialized object', () => {
        const testObj = { test: Date.now() }
        expect(
            toEqualJSON.call(mockedState, JSON.stringify(testObj), testObj)
        ).toMatchObject({
            pass: true
        })
    })

    it('should not pass for different deserialized object', () => {
        const testObj = { test: Date.now() }
        const anotherTestObj = { another: true }

        expect(
            toEqualJSON.call(mockedState, JSON.stringify(testObj), anotherTestObj)
        ).toMatchObject({
            pass: false
        })
    })

    it('should not pass for invalid JSON', () => {
        expect(
            toEqualJSON.call(mockedState, null, {})
        ).toMatchObject({
            pass: false
        })
    })
})

describe('toMatchJSON()', () => {

    it('should pass for deserialized object', () => {
        const testObj = { test: Date.now() }
        const complexTestObj = { ...testObj, complex: true }

        expect(
            toMatchJSON.call(mockedState, JSON.stringify(complexTestObj), testObj)
        ).toMatchObject({
            pass: true
        })
    })

    it('should not pass for different deserialized object', () => {
        const testObj = { test: Date.now() }
        const anotherTestObj = { another: true }

        expect(
            toMatchJSON.call(mockedState, JSON.stringify(testObj), anotherTestObj)
        ).toMatchObject({
            pass: false
        })
    })

    it('should not pass for invalid JSON', () => {
        expect(
            toMatchJSON.call(mockedState, null, {})
        ).toMatchObject({
            pass: false
        })
    })
})