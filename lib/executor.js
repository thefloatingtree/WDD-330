export function execute(expression, dataContext = {}) {
    let contextString = ""
    for (let [key, value] of Object.entries(dataContext)) {
        contextString += `let ${key} = ${JSON.stringify(value)};`
    }
    console.log(`"use strict";${contextString};return (${expression})`)
    return Function(`"use strict";${contextString};return (${expression})`)()
}