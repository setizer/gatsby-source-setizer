import {resolve} from "path";

import {isArray, isObject, countSimilarities} from "./utils/helpers";

export default class OnNode {
    constructor(props) {        
        this.node = props.node;
        this.actions = props.actions;
        this.getNodesByType = props.getNodesByType;

        this.config = this.getNodesByType("Config")[0];
    }

    Init() {
        this.config.languages.map(lang => {
            const element = this.getTranslate(this.node, lang);
            this.manageTypes(element, lang);
        });
    }

    manageTypes(node, currentLanguage) {
        const {createPage} = this.actions;

        let path = `/${currentLanguage}/`;
        let component, context;

        // /!\ get path with position on array

        // /!\ context send also config
        switch (node.type) {
            case "ACF":
                // custom template, send acf data
                if (node.slug && node.slug !== "index"){
                    path += `/${node.slug}`;
                }
                    
                component = resolve(`src/templates/${node.slug}.js`);

                context = {
                    currentLanguage,
                    ...node,
                    config: this.config,
                };

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

        if (path && component) {
            // console.log("createPage test", path, component, context);
            createPage({path, component, context});
        }
    }

    getTranslate(node, lang, element = {}) {    
        Object.keys(node).map(key => {
            if (key === "internal") return;
    
            const e = node[key];
            
            if (isArray(e)) {
                element[key] = this.getTranslate(e, lang, []);
            } else if (isObject(e)) {
                if (this.delectTranslateObject(e)) {
                    element[key] = e[lang];
                } else {
                    element[key] = this.getTranslate(e, lang);
                }
            } else {
                element[key] = e;
            }
        });
    
        return element;
    }
    
    delectTranslateObject(element) {
        const a = this.config.languages;
        const b = Object.keys(element);

        if (countSimilarities(a, b) >= a.length) {
            return true;
        }

        return false;
    }
}