
import {Component} from "../../src/classes/Component";


export default class TitlePage extends Component {
    template() {
        return `{
            rebuild:Bootstrap with {
                "submenu": "include:AboutMenu"
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
