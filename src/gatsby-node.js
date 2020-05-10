import axios from "axios";
import {capitalize} from "./utils/helpers";

const {
    flattenArray,
    getCurrentTimestamp,
    isArray,
    isObject,
    isObjEmpty,
} = require('./utils/helpers');

exports.sourceNodes = async (
    { actions: { createNode }, createContentDigest, createNodeId },
    { url, token }
) => {
    const res = await axios.get(`${url}?token=${token}`);

    if (res.data.status !== "success") 
        return;

    const { data } = res.data;

    Object
        .keys(data)
        .map(key => {
            const element = data[key];

            const nodeMeta = {
                id: createNodeId(key),
                parent: null,
                children: [],
                internal: {
                    type: capitalize(key),
                    mediaType: `text/html`, // TODO
                    content: JSON.stringify(element),
                    contentDigest: createContentDigest(element),
                },
            };

            createNode({
                ...element,
                ...nodeMeta,
            });
        });

    return;
}

exports.onCreateNode = ({node, getNodesByType}) => {
    if (node.internal.owner === "gatsby-source-setizer" && 
        node.internal.type === "Pages") {
        
        const [config] = getNodesByType("Config");

        // get config node ??
        
        console.log("node");
        console.log(node)
        console.log("config", config);
    }
}