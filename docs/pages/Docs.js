
import {Internal} from "../../src/classes/Application";


export default class DocsPage extends Internal {
    template() {
        return `{
            rebuild:bootstrap with {
                "submenu": "include:docsMenu"
            }
        }`
    }
    init () {
        this.state.caption = `Documentation`;
        this.state.content = `<p>Under development</p>`;
        console.dir(this.state.request.subject);
    }
}
