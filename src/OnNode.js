import {isArray, isObject, countSimilarities} from "./utils/helpers";

export default class OnNode {
    constructor(props) {        
        this.node = props.node;
        this.actions = props.actions;
        this.getNodesByType = props.getNodesByType;

        this.config = this.getNodesByType("Config")[0];
        // const {createPage} = this.actions;
    }

    manageLanguages() {
        this.config.languages.map(lang => {
            const element = this.getTranslate(this.node, lang, this.config.languages);
            console.log("end element translate", element);
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
        // console.log("====init", lang, node); 
    
        Object.keys(node).map(key => {
            if (key === "internal") return;
    
            const e = node[key];
            // console.log("e", e);
            
            if (isArray(e)) {
                element[key] = this.getTranslate(e, lang, []);
            } else if (isObject(e)) {
                // detect lang {en:.., fr:..}
                if (this.delectTranslateObject(e)) {
                    console.log("lang obj detected");
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
        const result = false;

        console.log(this.config.languages);
        console.log("element", Object.keys(element));

        console.log("nb simi", countSimilarities(this.config.languages, Object.keys(element)))

        return result;
    }
}