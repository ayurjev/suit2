
import {Internal} from "../../src/classes/Application";


export default class TitlePage extends Internal {
    template() {
        return `{
            rebuild:bootstrap with {
                "submenu": "include:aboutMenu"
            }
        }`
    }
    init () {
        this.state.caption = `Freaking-simple microframework for building modern web-applications...`;
        this.state.content = `
            <p>
                Designed to be be as powerfull as "react+redux+some kind of router" (but not that sophisticated) or as powerfull as angular (but not that verbose and opinionated).
            </p>
        `;
    }
}
