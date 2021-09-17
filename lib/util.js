export function doIfNotNull(value, callback) {
    if (value) callback(value)
}

export function getChildren(element) {
    return Array.from(element.children)
}