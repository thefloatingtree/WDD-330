import { execute } from './executor.js'
import { addUniqueTrackedListener, doIfNotNull, getChildren } from './util.js'

// Add a little sparkle ✨ to my HTML
// Modeled off alpine.js

// Has data, for, text, html, bind, if, on, ref, and init attributes...
// I need to finish async functionality and add new attributes:
// s-effect (this one might be pretty hard)
// Also want to add a store and a couple other useful injected global properties

const runOnInit = []
let hasInited = false

function addDataToProxy(proxy, data) {
    for (const [key, value] of Object.entries(data)) {
        if (proxy[key] && proxy[key].__noReactive) {
            proxy[key].value = value
        } else {
            proxy[key] = { __noReactive: true, value }
        }
    }
}

function getNearestRootElement(element) {
    while (element.parentElement) {
        if (element.parentElement.__rootElement) {
            return element.parentElement
        }
        element = element.parentElement
    }
    return null
}

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

        addDataToProxy(proxy, addToProxy)

        return proxy
    }
    return recursive(element, {})
}

function injectData(element, data) {
    // If there isn't already data, make a proxy
    if (!element.__sData) {
        element.__sData = data
        element.__sData = new Proxy(element.__sData, {
            set: (target, property, value) => {
                if (value.__noReactive) {
                    target[property] = value.value
                } else {
                    target[property] = value
                    runAttributes(element)
                }
                return true
            },
            get: (target, property) => {
                if (property == "__isProxy") return true
                return target[property]
            }
        })
    } else {
        // Otherwise add new data to exisiting proxy
        addDataToProxy(element.__sData, data)
    }
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
        element.__rootElement = true
    })
    // s-for
    // Repeat a child element
    doIfNotNull(element.getAttribute('s-for'), (expression) => {
        // Get list of items
        const [valueKey, dataKey] = expression.split(' in ')
        const list = execute(dataKey, getInjectedDataContext(element))

        // Get child element
        const children = getChildren(element)
        const childTemplate = children[0]

        element.__childTemplate = childTemplate ? childTemplate : element.__childTemplate

        // Clear template child element
        element.innerHTML = ""

        // Clone child element for each item in list
        list.forEach(value => {
            const clone = element.__childTemplate.cloneNode(true)
            injectData(clone, { [valueKey]: value })
            element.appendChild(clone)
        })
    })
    // s-ref
    // Display or don't
    doIfNotNull(element.getAttribute('s-ref'), (refKey) => {
        const nearestRootElement = getNearestRootElement(element)
        if (nearestRootElement) injectData(nearestRootElement, { [refKey]: element })
    })
    // s-if
    // Display or don't
    doIfNotNull(element.getAttribute('s-if'), (expression) => {
        const shouldDisplay = execute(expression, getInjectedDataContext(element))
        element.style.display = shouldDisplay ? 'inline' : 'none'
    })
    // s-bind
    // Bind an attribute on the element to a piece of data
    doIfNotNull(element.getAttribute('s-bind'), (attributeAndDataKeys) => {
        attributeAndDataKeys.split(' and ').forEach(attributeAndDataKey => {
            const [attribute, dataKey] = attributeAndDataKey.split(' to ')
            const value = execute(dataKey, getInjectedDataContext(element))

            if (attribute === 'class') {
                element.className = value
                return
            }

            element.setAttribute(attribute, value)
            element[attribute] = value
        })
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
    // s-on
    // Attach an event listener to the element
    doIfNotNull(element.getAttribute('s-on'), (eventsAndExpressions) => {
        eventsAndExpressions.split(' and ').forEach(eventAndExpression => {
            const [eventName, expression] = eventAndExpression.split(' do ')

            if (!expression) return

            addUniqueTrackedListener(element, eventName, (event) => {
                const magic = { $event: event }
                execute(expression, getInjectedDataContext(element), magic)
            })
        })
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

export function init() {
    getChildren(document.body).forEach(element => {
        runAttributes(element)
    })
    hasInited = true
    runOnInit.forEach(func => func())
}

window.onload = init