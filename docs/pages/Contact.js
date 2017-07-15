
import {Internal} from "../../src/classes/Application";


export default class ContactPage extends Internal {
    template() {
        return `{
            rebuild:bootstrap with
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
