
import {Component} from "../../src/classes/Component";


export default class DocsMenu extends Component {
    template() {
        return  `
            <nav class="verticalMenu">
                <ul>
                    <li><a href="/docs/variables">Variables</a>
                </ul>
            </nav>
        `;
    }
}
