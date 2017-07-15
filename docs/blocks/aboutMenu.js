
import {Component} from "../../src/classes/Component";


export default class AboutMenu extends Component {
    template() {
        return `
            <nav class="verticalMenu">
                <ul>
                    <li><a class="active" href="/about/motivation">Motivation</a></li>
                    <li><a href="/about/features">Main features & ideas</a></li>
                </ul>
            </nav>
        `;
    }
}
