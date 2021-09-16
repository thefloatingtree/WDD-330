export function doIfNotNull(value, callback) {
    if (value) callback(value)
}

// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
export function removeDuplicates(arr) {
    const set = new Set(arr)
    return Array.from(set.values())
}

export function getChildren(element) {
    return Array.from(element.children)
}