
import {Component} from "../../src/classes/Component";


export default class ContactPage extends Component {
    template() {
        return `{
            rebuild:Bootstrap with
            {caption: Contact me},
            {content:
                <p>
                    Github: <a href="https://github.com/ayurjev/suit2">https://github.com/ayurjev/suit2</a>
                </p>
                <p>
                    Contact me: <a href="mailto:$email">$email</a>
                </p>
            }
        }`
    }
    init() {
        this.state.email = "andrey.yurjev@gmail.com";
    }
}
