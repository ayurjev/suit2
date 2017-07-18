var assert = require('assert');

import {Application} from "../src/classes/Application";
import {Component} from "../src/classes/Component";
import {UnbalancedBracketsError, ComponentNotFoundError} from  "../src/classes/Exceptions";


describe('Compiler', () => {

    let app = new Application();

    class Page extends Component {
        template() {
            return `{$content || DEFAULT-CONTENT}`
        }
    }

    class Button extends Component {
        template() { return `<button>{$text}</button>`; }
        init() {
            this.api.getText = () => { return this.state.text; }
        }
    }

    class Button2 extends Button {
        template() { return `<button>{$text}2</button>`; }
    }

    class Parent extends Component {
        template() {
            return `{
                rebuild:Page with
                {content:
                    {include:Button}
                    {include:Button}
                    {include:Button2}
                }
            }`
        }
        init() {
            this.state.text = "DEFAULT TEXT FOR PARENT COMPONENT";
            this.api.getText = () => { return this.state.text; }
        }
    }


    it('should create correct component after rebuild operation', () => {
        let parent = app.createComponent(Parent, {}, {"Page": Page, "Button": Button, "Button2": Button2});
        parent.render();

        assert.equal("rootUID.Parent[0]", parent.uid);
        assert.equal(3, parent.components().length);
        assert.equal("Parent", parent.constructor.name);
    });


    it('should create components with different uid even if they being created from the same source class', () => {
        let parent = app.createComponent(Parent, {}, {"Page": Page, "Button": Button, "Button2": Button2});
        //parent.render();

        assert.equal(3, parent.components().length);
        assert.equal(2, parent.components(Button).length);

        var button1_uid = parent.components(Button)[0].uid;
        var button2_uid = parent.components(Button)[1].uid;
        var button3_uid = parent.components(Button2)[0].uid;

        assert(button1_uid != button2_uid);
        assert(button2_uid != button3_uid);
    });

    it('should keep uids even if component gets refreshed, and state of child components should remain', () => {
        let parent = app.createComponent(Parent, {}, {"Page": Page, "Button": Button, "Button2": Button2});
        parent.render();

        var button1_uid = parent.components(Button)[0].uid;
        var button2_uid = parent.components(Button)[1].uid;
        var button3_uid = parent.components(Button2)[0].uid;

        assert.equal("DEFAULT TEXT FOR PARENT COMPONENT", parent.api.getText());
        assert.equal("DEFAULT TEXT FOR PARENT COMPONENT", parent.components(Button)[0].api.getText());
        assert.equal("DEFAULT TEXT FOR PARENT COMPONENT", parent.components(Button)[1].api.getText());
        assert.equal("DEFAULT TEXT FOR PARENT COMPONENT", parent.components(Button2)[0].api.getText());

        parent.components(Button)[0].state.text = "Button instance 1";
        parent.components(Button)[1].state.text = "Button instance 2";
        parent.components(Button2)[0].state.text = "Button2 instance 1";
        assert.equal("DEFAULT TEXT FOR PARENT COMPONENT", parent.api.getText());
        assert.equal("Button instance 1", parent.components(Button)[0].api.getText());
        assert.equal("Button instance 2", parent.components(Button)[1].api.getText());
        assert.equal("Button2 instance 1", parent.components(Button2)[0].api.getText());

        parent.state.text = "NEW TEXT FOR PARENT COMPONENT";
        parent.refresh();
        assert.equal("NEW TEXT FOR PARENT COMPONENT", parent.api.getText());
        assert.equal("Button instance 1", parent.components(Button)[0].api.getText());
        assert.equal("Button instance 2", parent.components(Button)[1].api.getText());
        assert.equal("Button2 instance 1", parent.components(Button2)[0].api.getText());

    });



});
