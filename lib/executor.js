// A lot of this was taken and modified from alpine's source. 
// This seems like the best way of doing it, no need to reinvent the wheel!
export function execute(expression, dataContext = {}, magicContext = {}) {
    let AsyncFunction = Object.getPrototypeOf(async function () { }).constructor

    let rightSideSafeExpression = 0
        // Support expressions starting with "if" statements like: "if (...) doSomething()"
        || /^[\n\s]*if.*\(.*\)/.test(expression)
        // Support expressions starting with "let/const" like: "let foo = 'bar'"
        || /^(let|const)/.test(expression)
        ? `(() => { ${expression} })()`
        : expression

    // for some reason 'this' is not binding correctly, instead, bind the first argument to the data context. Use like the 'self' parameter to methods in Python
    for (const [key, value] of Object.entries(dataContext)) {
        if (typeof value === 'function') {
            if (value.__alreadyBound) continue
            const boundFunction = value.bind(dataContext, dataContext)
            boundFunction.__alreadyBound = true
            dataContext[key] = { __noReactive: true, value: boundFunction }
        }
    }

    // console.log({ expression, dataContext, magicContext })
    // console.log(`with (magic) { with (scope) { __self.result = ${rightSideSafeExpression} }}; __self.finished = true; return __self.result;`)

    let func = new AsyncFunction(['__self', 'scope', 'magic'], `with (magic) { with (scope) { __self.result = ${rightSideSafeExpression} }}; __self.finished = true; return __self.result;`)
    let promise = func(func, dataContext, magicContext)

    // TODO: finish async stuff

    if (func.finished) {
        return func.result
    }
}