
import {Component} from "../../src/classes/Component";


export default class TopMenu extends Component {
    template() {
        return `
            <nav class="topMenu">
                <ul>
                    <li><a class="active" href="/about/">About</a></li>
                    <li><a href="/docs/">Docs</a></li>
                    <li><a href="/contact/">Contact</a></li>
                </ul>
            </nav>
        `;
    }
}
