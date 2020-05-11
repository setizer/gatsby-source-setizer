// Destructure array and turn to string
function flattenArray(array) {
    return [].concat(...array)
}

// Make unix timestamp
function getCurrentTimestamp() {
    return Math.round(new Date().getTime() / 1000)
}

// Check if element is array
function isArray(element) {
    if (!element) return false
    return element.constructor === Array
}

// Check if element is an object
function isObject(element) {
    if (!element) return false
    if (typeof element !== 'object') return false
    if (element instanceof Array) return false
    return true
}

// Check if element is an object and empty
function isEmptyObject(element) {
    if (isObject(element) && !Object.keys(element).length) 
        return true;
    return false;
}

// Check object key to see if it has values
function isObjEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false
    }
    return true
}

// Capitalize first letter
function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}

//
function objectIndexes(element) {
    return element.map((obj, id) => {
        obj["index"] = id;
        return obj;
    });
}

module.exports = {
    flattenArray,
    getCurrentTimestamp,
    isArray,
    isObject,
    isEmptyObject,
    isObjEmpty,
    capitalize,
    objectIndexes,
}
