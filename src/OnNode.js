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
            console.log("end element translate", element);

            const {createPage} = this.actions; 
            //...
        });
    }

    manageTypes() {
        // /!\ context send also config
        switch (this.node.type) {
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