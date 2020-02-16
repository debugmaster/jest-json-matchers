import "./register"

it('should register toBeJSON()', () => {
    expect(JSON.stringify({})).toBeJSON()
})

it('should register toEqualJSON()', () => {
    const testObj = { test: true }
    expect(JSON.stringify(testObj)).toEqualJSON(testObj)
})

it('should register toMatchJSON()', () => {
    const testObj = { test: true }
    const extendedObj = { ...testObj, extended: true }
    expect(JSON.stringify(extendedObj)).toMatchJSON(testObj)
})