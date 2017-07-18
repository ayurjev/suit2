var assert = require('assert');

import {Application} from "../src/classes/Application";
import {Component} from "../src/classes/Component";
import {UnbalancedBracketsError, ComponentNotFoundError} from  "../src/classes/Exceptions";


describe('Compiler', () => {

    let app = new Application();

    it('should tell us if template has unbalanced brackets', () => {
        class TestComponent extends Component {
            template() {
                return 'His name is <b>{$user.name}</b> and he is {$user.age years old';
            }
        }
        assert.throws(() => { app.createComponent(TestComponent) }, UnbalancedBracketsError);
    });

    it('should tell us if we forgot to define includes correctly', () => {
        class TestComponent extends Component {
            template() {
                return '{rebuild:bootstrap with {"content": "REBASED-CONTENT"}}';
            }
        }
        assert.throws(() => {
            let component = app.createComponent(
                TestComponent,
                {}, // state is empty, doesn't matter...
                {}, // includes are empty, so no bootstrap widget can be found...
            );
            component.render();
        }, ComponentNotFoundError);
    });

});
