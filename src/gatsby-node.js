import path from "path";
import axios from "axios";
import {capitalize} from "./utils/helpers";

const {
    isEmptyObject,
    objectIndexes
} = require('./utils/helpers');

exports.sourceNodes = async (
    { actions: { createNode }, createContentDigest, createNodeId },
    { url, token }
) => {
    const res = await axios.get(`${url}?token=${token}`);

    if (res.data.status !== "success" && isEmptyObject(res.data.data)) 
        throw new Error("Error with the request.");

    const { data } = res.data;

    Object
    .keys(data)
    .map(key => {
        const element = data[key];
        const nodeMeta = (key, element, id=false) => {
            const nodeId = id ? `${key}-${element[id]}` : key;
            
            return {
                id: createNodeId(nodeId),
                parent: null,
                children: [],
                internal: {
                    type: capitalize(key),
                    mediaType: `text/html`, // TODO
                    content: JSON.stringify(element),
                    contentDigest: createContentDigest(element),
                },
            }
        };

        if (isEmptyObject(element)) return;
        
        switch (key) {
            case "foreign":
                Object
                .keys(element)
                .map(fkName => {
                    const fk = objectIndexes(element[fkName]);

                    fk.map(f => {
                        createNode({
                            ...f, ...nodeMeta(fkName, f, "index")
                        });
                    });
                });
                break;
            case "pages":
                element.map(page => {
                    createNode({
                        ...page,
                        ...nodeMeta(key, page, "slug"),
                    });
                });
                break;
            default:
                createNode({
                    ...element,
                    ...nodeMeta(key, element),
                });
                break;
        };
    });

    return;
}

exports.onCreateNode = ({node, actions, getNodesByType}) => {
    if (node.internal.owner === "gatsby-source-setizer" && 
        node.internal.type === "Pages") {
        
        const [config] = getNodesByType("Config");
        const {createPage} = actions;

        // ! languages => loop + get content just for the language
        console.log("config", config);

        // context send also config

        console.log("node", node)
        switch (node.type) {
            case "ACF":
                // custom template, send acf data
                break;
            
            case "Dynamic":
                // template global => send all element, pagination ?
                // template global for 1 element => send an element
                break;

            case "Markdown":
                // default template
                // transform content to html
                break;

            case "HTML":
                // default template
                break;

            default:
                break;
        }
    }
}