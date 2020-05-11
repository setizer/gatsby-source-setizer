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
                const nodeId = id ? `${key}-${element.index}` : key;
                
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
            
            if (key === "foreign") {
                Object
                    .keys(element)
                    .map(fkName => {
                        const fk = objectIndexes(element[fkName]);

                        fk.map(f => {
                            createNode({
                                ...f, ...nodeMeta(fkName, f, true)
                            });
                        });
                    });
                return;
            };

            // createNode({
            //     ...element,
            //     ...nodeMeta(key, element),
            // });
        });

    return;
}

exports.onCreateNode = ({node, actions, getNodesByType}) => {
    if (node.internal.owner === "gatsby-source-setizer" && 
        node.internal.type === "Pages") {
        
        const [config] = getNodesByType("Config");
        const {createPage} = actions;

        // ! languages
        // dynamic type ?

        console.log("node", node)
        console.log("config", config);
        console.log("actions", createPage);
    }
}