import { execute } from './executor.js'
import { doIfNotNull, getChildren } from './util.js'

// Add a little sparkle ✨ to my HTML
// Modeled off alpine.js

// Has data, for, text, bind, and init attributes...
// I need to finish async functionality and add new attributes:
// s-on (once this is done, I can do more rigorous testing on the reactive stuff)
// s-if
// s-effect (this one might be pretty hard)
// Also want to add a store and a couple other useful injected global properties

const runOnInit = []
let hasInited = false

function getInjectedDataContext(element) {
    // Go up the parent chain and append each element's data to the context
    function recursive(element, data) {
        if (!element.parentElement) return {}
        const parentsData = recursive(element.parentElement, getInjectedData(element))

        // Everything below is UGLY and needs to be looked at again someday
        // Make sure we are adding information into the proxy not into a regular object
        let proxy = {}
        let addToProxy = {}
        if (data.__isProxy || (data.__isProxy && parentsData.__isProxy)) {
            proxy = data
            addToProxy = parentsData
        }
        if (parentsData.__isProxy) {
            proxy = parentsData
            addToProxy = data
        }

        for (const [key, value] of Object.entries(addToProxy)) {
            if (proxy[key] && proxy[key].__noReactive) {
                proxy[key].value = value
            } else {
                proxy[key] = { __noReactive: true, value }
            }
        }

        return proxy
    }
    return recursive(element, {})
}

function injectData(element, data) {
    // Inject data into an element
    element.__sData = { ...element.__sData, ...data }
    element.__sData = new Proxy(element.__sData, {
        set: (target, property, value) => {
            if (value.__noReactive) {
                target[property] = value.value
                console.log("SET", property, value.value)
            } else {
                target[property] = value
                console.log("SET", property, value)
                runAttributes(element)
            }
            return true
        },
        get: (target, property, receiver) => {
            console.log("GET", property)
            if (property == "__isProxy") return true
            return target[property]
        }
    })
}

function getInjectedData(element) {
    // Retrieve injected data from an element
    return element.__sData ? element.__sData : {}
}

function runAttributes(element) {
    // s-data
    // Inject data into the element
    if (!hasInited) doIfNotNull(element.getAttribute('s-data'), (expression) => {
        const data = execute(expression)
        injectData(element, data)
    })
    // s-for
    // Repeat a child element
    doIfNotNull(element.getAttribute('s-for'), (expression) => {
        // Get list of items
        const [valueKey, dataKey] = expression.split(' in ')
        const list = execute(dataKey, getInjectedDataContext(element))

        // Get child element
        const children = getChildren(element)
        if (children.length !== 1) return
        const child = children[0]

        // Clear template child element
        element.innerHTML = ""

        // Clone child element for each item in list
        list.forEach(value => {
            const clone = child.cloneNode(true)
            injectData(clone, { [valueKey]: value })
            element.appendChild(clone)
        })
    })
    // s-bind
    // Bind an attribute on the element to a piece of data
    doIfNotNull(element.getAttribute('s-bind'), (expression) => {
        const [boundAttribute, dataKey] = expression.split(' to ')
        const value = execute(dataKey, getInjectedDataContext(element))

        element[boundAttribute] = value
    })
    // s-text
    // Inject a piece of data into element's innerText
    doIfNotNull(element.getAttribute('s-text'), (expression) => {
        const text = execute(expression, getInjectedDataContext(element))
        element.innerText = text
    })
    // s-html
    // Inject a piece of data into element's innerHTML
    doIfNotNull(element.getAttribute('s-html'), (expression) => {
        const html = execute(expression, getInjectedDataContext(element))
        element.innerHTML = html
    })
    // s-init
    // Run expressions on sparkle init
    if (!hasInited) doIfNotNull(element.getAttribute('s-init'), (expression) => {
        runOnInit.push(() => execute(expression, getInjectedDataContext(element)))
    })

    // Process children
    getChildren(element).forEach(child => {
        runAttributes(child)
    })
}

function init() {
    const rootElements = getChildren(document.body)
    rootElements.forEach(element => {
        runAttributes(element)
    })
    hasInited = true
    runOnInit.forEach(func => func())
}

console.time("First render")
init()
console.timeEnd("First render")