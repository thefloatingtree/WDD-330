import { doIfNotNull, parseLazyJSON, getChildren } from './util.js'

// Add a little sparkle ✨ to my HTML
// Modeled off alpine.js

// Only has data, for, text, and bind attributes for now...
// I want to add reactivity and also more attributes!

function getInjectedDataContext(element) {
    // Go up the parent chain and append each elements data to the context
    function recursive(element, data) {
        if (!element.parentElement) return {}
        return { ...data, ...recursive(element.parentElement, getInjectedData(element)) }
    }
    return recursive(element, {})
}

function injectData(element, data) {
    // Inject data into an element
    element._s_data = { ...element._s_data, ...data }
}

function getInjectedData(element) {
    // Retrieve injected data from an element
    return element._s_data ? element._s_data : {}
}

function getValueFromDataContext(element, dotSeparatedKeys) {
    // Get a value from data context
    const keys = dotSeparatedKeys.split('.')
    const dataContext = getInjectedDataContext(element)
    let value = dataContext
    keys.forEach(key => {
        value = value[key]
    })
    return value
}

function runAttributes(element) {
    // s-data
    // Inject data into the element
    // TODO: Improve the attributeInput parsing to include function and expression evaluation
    doIfNotNull(element.getAttribute('s-data'), (attributeInput) => {
        const data = parseLazyJSON(attributeInput)
        injectData(element, data)
    })
    // s-for
    // Repeat a child element
    doIfNotNull(element.getAttribute('s-for'), (attributeInput) => {
        // Get list of items
        const [valueKey, dataKey] = attributeInput.split(' in ')
        const list = getValueFromDataContext(element, dataKey)
        
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
    doIfNotNull(element.getAttribute('s-bind'), (attributeInput) => {
        const [boundAttribute, dataKey] = attributeInput.split(' to ')
        const value = getValueFromDataContext(element, dataKey)

        element[boundAttribute] = value
    })
    // s-text
    // Inject a piece of data into element's innerText
    doIfNotNull(element.getAttribute('s-text'), (attributeInput) => {
        const text = getValueFromDataContext(element, attributeInput)
        element.innerText = text
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
}

init()