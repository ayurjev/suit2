var assert = require('assert');

import {Application} from "../src/classes/Application";
import {Component} from "../src/classes/Component";


describe('Component', () => {

    let app = new Application();

    class TestInclusion extends Component {
        template() { return "His name is <b>{$user.name}</b> and he is {$user.age} years old"}
        init() {
            this.api.change = (name, age) => {
                this.state.user.name = name;
                this.state.user.age = age;
                this.state.local_property = "xxx";
                this.refresh();
            }

            this.api.get_state = () => { return this.state; }
        }
    }

    it('should convert internal inclusions into components api', () => {

        class TestComponent extends Component {
            template() { return "His name is <b>{$user.name}</b> and he is {$user.age} years old"}
            init() {
                this.includes = {"test_inclusion": this.component(TestInclusion)};
                this.api.get_test_inclusion = () => { return this.includes.test_inclusion; }
            }
        }

        let component = app.component(TestComponent);

        assert(component.getApi()["init"] instanceof Function);
        assert(component.getApi()["uid"] instanceof Function);
        assert(component.getApi()["get_test_inclusion"] instanceof Function);
        assert(component.getApi().get_test_inclusion() instanceof Component);
    });

    it('should allow us to change its state and refresh it from inside', () => {

        class TestComponent extends Component {
            template() { return "His name is <b>{$user.name}</b> and he is {$user.age} years old"}
            init() {
                this.api.change = () => {
                    this.state.user.name = "Andrey";
                    this.state.user.age = 28;
                    this.refresh();
                }
            }
        }

        let component = app.component(TestComponent);

        // check component's api:
        assert(component.getApi()["init"] instanceof Function);
        assert(component.getApi()["uid"] instanceof Function);
        assert(component.getApi()["change"] instanceof Function);

        // no state at all:
        assert.equal('His name is <b>null</b> and he is null years old', component.render());

        // forced state:
        assert.equal('His name is <b>Ivan</b> and he is 14 years old', component.render({user: {name: "Ivan", age: 14}}));

        // Changing state:
        component.getApi().change();
        assert.equal('His name is <b>Andrey</b> and he is 28 years old', component.render());
    });

    it('should share state between components if componentr configured to work with shared state', () => {
        let sharedStateApp = new Application({}, {state: "shared"});

        class TestComponent extends Component {
            template() {
                return `
                    His name is <b>{$user.name}</b> and he is {$user.age} years old,
                    {include:test_inclusion}
                `
            }
            init() {
                this.includes = {"test_inclusion": this.component(TestInclusion)};

                this.api.change_parent = () => {
                    this.state.user.name = "Andrey";
                    this.state.user.age = 28;
                    this.refresh();
                };

                this.api.change_child = () => {
                    this.includes.test_inclusion.getApi().change("Nikolay", 32);
                };
            }
        }

        let component = sharedStateApp.component(TestComponent);

        // no state at all:
        assert.equal(
            'His name is <b>null</b> and he is null years old, His name is <b>null</b> and he is null years old',
            component.render()
        );

        // forced state:
        assert.equal(
            'His name is <b>Ivan</b> and he is 14 years old, His name is <b>Ivan</b> and he is 14 years old',
            component.render({user: {name: "Ivan", age: 14}})
        );

        // Changing state of parent component:
        component.getApi().change_parent();
        assert.equal(
            'His name is <b>Andrey</b> and he is 28 years old, His name is <b>Andrey</b> and he is 28 years old',
            component.render()
        );

        // Changing state of child component:
        component.getApi().change_child();
        assert.equal(
            'His name is <b>Nikolay</b> and he is 32 years old, His name is <b>Nikolay</b> and he is 32 years old',
            component.render()
        );
    });

    it('should NOT share state between components if componentr configured to work with local state', () => {
        let localStateApp = new Application({}, {state: "local"});

        class TestComponent extends Component {
            template() {
                return `
                    His name is <b>{$user.name}</b> and he is {$user.age} years old,
                    {include:test_inclusion}
                `
            }
            init() {
                this.includes = {"test_inclusion": this.component(TestInclusion)};

                this.api.get_state_from_parent = () => {
                    return this.state;
                }

                this.api.get_state_from_child = () => {
                    return this.includes.test_inclusion.getApi().get_state();
                }

                this.api.change_parent = () => {
                    this.state.user.name = "Andrey";
                    this.state.user.age = 28;
                    this.refresh();
                }

                this.api.change_child = () => {
                    this.includes.test_inclusion.getApi().change("Nikolay", 32);
                }
            }
        }

        let component = localStateApp.component(TestComponent);

        // no state at all:
        assert.equal(
            'His name is <b>null</b> and he is null years old, His name is <b>null</b> and he is null years old',
            component.render()
        );

        // forced state:
        assert.equal(
            'His name is <b>Ivan</b> and he is 14 years old, His name is <b>Ivan</b> and he is 14 years old',
            component.render({user: {name: "Ivan", age: 14}})
        );

        // Changing state of parent component:
        component.getApi().change_parent();

        assert.equal(
            'His name is <b>Andrey</b> and he is 28 years old, His name is <b>Andrey</b> and he is 28 years old',
            component.render()
        );

        // Changing state of child component:
        component.getApi().change_child();

        // Child has a new state, while parent still has an old version:
        assert.deepEqual({user: {name: 'Andrey', age: 28}}, component.getApi().get_state_from_parent());
        assert.deepEqual({user: {name: 'Nikolay', age: 32}, local_property: "xxx"}, component.getApi().get_state_from_child());

        // But when we call render() parent component delegates it's version of the state to the child:
        assert.equal(
            'His name is <b>Andrey</b> and he is 28 years old, His name is <b>Andrey</b> and he is 28 years old',
            component.render()
        );

        // So child's state has been changed back, but the property 'local_property' remained in the child's state:
        assert.deepEqual({user: {name: 'Andrey', age: 28}}, component.getApi().get_state_from_parent());
        assert.deepEqual({user: {name: 'Andrey', age: 28}, local_property: "xxx"}, component.getApi().get_state_from_child());
    });

});
