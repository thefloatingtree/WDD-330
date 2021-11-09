export function execute(expression, dataContext = {}, magicContext = {}) {
    // Some fancy Regex magic taken from alpine.js' source
    // Basically, if the expression starts with 'if' or 'let'/'const' wrap them in an anonymous function
    const rightSideSafeExpression = 0
        // Support expressions starting with "if" statements like: "if (...) doSomething()"
        || /^[\n\s]*if.*\(.*\)/.test(expression)
        // Support expressions starting with "let/const" like: "let foo = 'bar'"
        || /^(let|const)/.test(expression)
        ? `(() => { ${expression} })()`
        : expression

    // For any functions in the dataContext, bind the dataContext to them as 'this'
    for (const [key, value] of Object.entries(dataContext)) {
        if (typeof value === 'function') {
            if (value.__alreadyBound) continue
            const boundFunction = value.bind(dataContext)
            boundFunction.__alreadyBound = true
            dataContext[key] = { __noReactive: true, value: boundFunction }
        }
    }

    // Run the expression with the dataContext
    const func = new Function(['__self', 'scope', 'magic'], 
        `
        with (magic) { 
            with (scope) {
                __self.result = ${rightSideSafeExpression};
            }
        }
        return __self.result;`
    )
    func(func, dataContext, magicContext)
    return func.result
}