export function doIfNotNull(value, callback) {
    if (value) callback(value)
}

export function getChildren(element) {
    return Array.from(element.children)
}

export function addUniqueTrackedListener(element, type, handler) {
    if (!element.__trackedEvents) element.__trackedEvents = {}
    if (!element.__trackedEvents[type]) element.addEventListener(type, handler)
    element.__trackedEvents[type] = true
};