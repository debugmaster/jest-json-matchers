import type { MatcherContext, ExpectationResult, SyncExpectationResult } from 'expect'
// @ts-ignore types are missing because matchers are not meant to be exposed
import matchers from 'expect/build/matchers'

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeJSON(): R;
            toEqualJSON(b: any): R;
            toMatchJSON(b: any): R;
        }
        interface Expect {
            jsonContaining<E = {}>(b: E): any;
        }
    }
}

export function toBeJSON(this: MatcherContext, received: unknown): SyncExpectationResult {
    if (typeof received !== 'string') {
        return {
            pass: false,
            message: () => [
                'expected',
                this.utils.printReceived(received),
                'to be JSON, but it is not a',
                this.utils.EXPECTED_COLOR('JSON string')
            ].join(' ')
        }
    }

    try {
        JSON.parse(received)
        return {
            pass: true,
            message: () => [
                'expected',
                this.utils.printReceived(received),
                'not to be JSON, but it is a',
                this.utils.EXPECTED_COLOR('JSON string')
            ].join(' ')
        }
    } catch (e) {
        return {
            pass: false,
            message: () => [
                'expected',
                this.utils.printReceived(received),
                'to be JSON, but it is not a',
                this.utils.EXPECTED_COLOR('valid JSON string')
            ].join(' ')
        }
    }
}

export function toEqualJSON(this: MatcherContext, received: unknown, jsonObject: any): ExpectationResult {
    var isJSON = toBeJSON.call(this, received)

    if (!isJSON.pass) {
        return isJSON
    }

    return matchers.toEqual.call(this, JSON.parse(received as string), jsonObject)
}

export function toMatchJSON(this: MatcherContext, received: unknown, jsonObject: any): ExpectationResult {
    var isJSON = toBeJSON.call(this, received)

    if (!isJSON.pass) {
        return isJSON
    }

    return matchers.toMatchObject.call(this, JSON.parse(received as string), jsonObject)
}

export function jsonContaining(this: MatcherContext, received: unknown, jsonObject: any): ExpectationResult {
    return toMatchJSON.call(this, received, jsonObject)
}