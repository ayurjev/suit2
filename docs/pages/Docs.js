
import {Component} from "../../src/classes/Component";


export default class DocsPage extends Component {

    template() {
        return `{
            rebuild:Bootstrap with {
                "submenu": "include:DocsMenu",
                "caption": "Documentation"
            }
        }`
    }

    init () {
        this.variables = this.createComponent(require("../articles/Variables"));

        switch (this.state.request.subject) {
            case "variables":
                this.state.caption = "Variables";
                this.state.content = this.variables.render();    
                break;
            default:
                this.state.content = `<p>Under development</p>`;
        }
    }
}
