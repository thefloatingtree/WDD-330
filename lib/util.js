export function doIfNotNull(value, callback) {
    if (value) callback(value)
}

// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
export function removeDuplicates(arr) {
    const set = new Set(arr)
    return Array.from(set.values())
}

export function parseLazyJSON(lJSON) {
    // Regex black magic to find all the keys and strings
    let matches = lJSON.match(/([a-z][^:]*)(?=\s*)|('([^']+)')|('')/g)
    let output = lJSON

    // Remove duplicates so that we don't end up with matches being double replaced e.g. ""key"": 1
    matches = removeDuplicates(matches)

    // Add quotes to each match, make sure to account for matches that already have single quotes
    matches.forEach(match => {
        let processedMatch = match
        // Account for single quotes
        if (match[0] === "'") {
            processedMatch = match.slice(1, -1)
        }
        // Add quotes and replace
        processedMatch = `"${processedMatch}"`
        output = output.replaceAll(match, processedMatch)
    })
    return JSON.parse(output)
}

export function getChildren(element) {
    return Array.from(element.children)
}