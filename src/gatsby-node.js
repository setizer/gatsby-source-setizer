import path from "path";
import axios from "axios";

import {
    isEmptyObject,
    objectIndexes,
    capitalize,
} from "./utils/helpers";
import OnNode from "./OnNode";

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

exports.onCreateNode = (props) => {
    const {node} = props;

    if (node.internal.owner === "gatsby-source-setizer" && 
        node.internal.type === "Pages") {

        const Node = new OnNode(props);

        Node.Init();
    }

}
