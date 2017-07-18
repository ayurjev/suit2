
import {Component} from "../../src/classes/Component";

class Button extends Component {
    template() {
        return `<button>{$text}</button>`;
    }
    createListeners() {
        this.tag().addEventListener("click", () => {
            this.broadcast("BUTTON_CLICKED", {text: this.state.text});
        });
    }
}

export default class PgPage extends Component {

    template() {
        return `{
            rebuild:Bootstrap with
            {caption: Playground},
            {content:
                <button id="element-inside-html">Should say 'element-inside-html' and then 'button'</button>
                <button>Should say 'button' and only once</button>
                {include:Button with {"text": "Should say 'button' and then 'Im a child component'"}}
                {include:Button with {"text": "Should say 'button' and then 'Im a child component too!'"}}
            }
        }`
    }

    init () {
        this.includes.Button = Button;
    }

    createListeners() {

        this.elem("#element-inside-html").addEventListener("click", function() {
            alert(this.id);
        });

        this.elems("button").forEach((b) => {
            b.addEventListener("click", function() {
                alert(this.tagName);
            })
        });

        this.subscribe("BUTTON_CLICKED", (e) => {
            alert(e.text);
        });


    }
}
