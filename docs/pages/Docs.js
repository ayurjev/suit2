
import {Internal} from "../../src/classes/Application";


export default class DocsPage extends Internal {

    constructor() {
        super();
        this.variables = this.widget(require("../articles/variables"));

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
        switch (this.state.request.subject) {
            case "variables":
                this.state.content = this.variables.render();
                break;
            default:
                this.state.content = `<p>Under development</p>`;
        }
    }
}
