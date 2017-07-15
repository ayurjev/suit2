
import {Internal} from "../../src/classes/Application";


export default class DocsPage extends Internal {

    constructor() {
        super();
        this.includes = {
            variables: require("../articles/variables")
        };
    }

    template() {
        return `{
            rebuild:bootstrap with {
                "submenu": "include:docsMenu",
                "caption": "Documentation"
            }
        }`
    }

    init () {
        this.variables_api = this.includes.variables.api();
        switch (this.state.request.subject) {
            case "variables":
                this.state.content = this.includes.variables.render();
                break;
            default:
                this.state.content = `<p>Under development</p>`;
        }
        console.dir(this.variables_api.init_code());
    }
}
