
import {Component} from "../../../src/classes/Component";


export default class MotivationPage extends Component {
    template() {
        return `
        {rebuild:Bootstrap with
            {submenu: include:AboutMenu},
            {caption: Why?},
            {content:
                <p>
                    I have worked a lot with different kind of frameworks and libraries in order to find a way to build modern web-applications with ease and comfort... Even though there is a huge amount of options - I failed to find the right one.
                </p>

                <p>
                    Yes, I've built plenty of web-applications using all of those technologies that I tried on my way, but I didn't found a combination of flexibility and straightforwardness I was looking for...
                </p>

                <p>
                    I needed a tool, that would be as powerfull as "react+redux+some kind of router" (but not that sophisticated) or as powerfull as angular (but not that verbose and opinionated).
                </p>

                <p>
                    So, I decided to build it myself. Why not? At least it should've been fun and much more interesting than my regular work at the time...
                </p>

                <p>
                    I decided to take everything that seemed to me as a good idea from other tools I learned, but get rid of any kind of complexity or syntax uglyness...
                </p>

                <p>
                    I know, that "Suit" may lack a lot of things because of absence of that complexity, but this way it gained a great benefit - simplicity.
                </p>

                <p>
                    P.S. This particular website is built with "Suit" while "Suit" was under development and testing, this was my approach to try it myself before demonstrating it to other people.
                </p>
            }
        }`;
    }
}
