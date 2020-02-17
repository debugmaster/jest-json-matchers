import { MatcherState, ExpectationResult, SyncExpectationResult } from 'expect/build/types'

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeJSON(): R;
            toEqualJSON(b: any): R;
            toMatchJSON(b: any): R;
        }
    }
}

export function toBeJSON(this: MatcherState, received: unknown): SyncExpectationResult {
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

export function toEqualJSON(this: MatcherState, received: unknown, jsonObject: any): ExpectationResult {
    var isJSON = toBeJSON.call(this, received)

    if (!isJSON.pass) {
        return isJSON
    }

    return findMatchers().toEqual.call(this, JSON.parse(received as string), jsonObject)
}

export function toMatchJSON(this: MatcherState, received: unknown, jsonObject: any): ExpectationResult {
    var isJSON = toBeJSON.call(this, received)

    if (!isJSON.pass) {
        return isJSON
    }

    return findMatchers().toMatchObject.call(this, JSON.parse(received as string), jsonObject)
}

type MatcherMap = {
    [key: string]: (this: MatcherState, received: unknown, ...params: any[]) => ExpectationResult
}

let matchers: MatcherMap
function findMatchers() {
    if (matchers) return matchers
    const symbols = Object.getOwnPropertySymbols(global)
    for (const symbol of symbols) {
        if (symbol.toString().includes('jest-matchers-object')) {
            // @ts-ignore global is not indexed and index signature can't be symbols
            matchers = global[symbol].matchers
            return matchers
        }
    }

    throw new Error('It could not find Jest matchers')
}