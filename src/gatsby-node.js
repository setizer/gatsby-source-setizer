const {
    flattenArray,
    getCurrentTimestamp,
    isArray,
    isObject,
    isObjEmpty,
} = require('./utils/helpers');

let activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development'

if (activeEnv == 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

exports.sourceNodes = async (
    { actions: { createNode }, createContentDigest, createNodeId },
    { plugins, url, token }
) => {

    console.log("source", url, token);
        
}
