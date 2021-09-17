// A lot of this was taken and modified from alpine's source. 
// This seems like the best way of doing it, no need to reinvent the wheel!
export function execute(expression, dataContext = {}) {
    let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

    let rightSideSafeExpression = 0
        // Support expressions starting with "if" statements like: "if (...) doSomething()"
        || /^[\n\s]*if.*\(.*\)/.test(expression)
        // Support expressions starting with "let/const" like: "let foo = 'bar'"
        || /^(let|const)/.test(expression)
            ? `(() => { ${expression} })()`
            : expression

    let func = new AsyncFunction(['__self', 'scope'], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`)
    let promise = func(func, dataContext)

    // TODO: finish async stuff

    if (func.finished) {
        return func.result
    }
}