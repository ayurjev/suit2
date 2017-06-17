var assert = require('assert');

import {Compiler,Widget} from "../src/classes/Compiler";


describe('Widget', () => {

    it('should have default api() method', () => {
        let c = new Compiler();

        let widget = c.compile(
            {template: 'anything'}
        );
        // check widget's api:
        assert(widget.api()["createListeners"] instanceof Function);
        assert(widget.api()["uid"] instanceof Function);
    });

    it('should convert internal inclusions into widgets api', () => {
        let c = new Compiler();

        let widget = c.compile(
            {
                template: '{include:test_inclusion}',
                init: function(internal) {
                    internal.includes = {
                        "test_inclusion": require("../src/app/test_inclusion")
                    };
                    internal.api.get_test_inclusion = function() {
                        return internal.includes.test_inclusion;
                    }
                }
            }
        );
        // check widget's api:
        assert(widget.api()["createListeners"] instanceof Function);
        assert(widget.api()["uid"] instanceof Function);
        assert(widget.api()["get_test_inclusion"] instanceof Function);

        // before render():
        assert(typeof widget.api().get_test_inclusion()["template"] === "string");
        assert(widget.api().get_test_inclusion()["init"] instanceof Function);
        widget.render();
        // after render():
        assert(widget.api().get_test_inclusion()["createListeners"] instanceof Function);
        assert(widget.api().get_test_inclusion()["uid"] instanceof Function);
    });

    it('should allow to us to change its state and refresh it from inside', () => {
        let c = new Compiler();

        let widget = c.compile(
            {
                template: 'His name is <b>{$user.name}</b> and he is {$user.age} years old',
                init: function(internal) {
                    internal.api.change = function() {
                        internal.state.user.name = "Andrey";
                        internal.state.user.age = 28;
                        internal.refresh();
                    }
                }
            }
        );
        // check widget's api:
        assert(widget.api()["createListeners"] instanceof Function);
        assert(widget.api()["uid"] instanceof Function);
        assert(widget.api()["change"] instanceof Function);

        // no state at all:
        assert.equal('His name is <b>null</b> and he is null years old', widget.render());

        // forced state:
        assert.equal('His name is <b>Ivan</b> and he is 14 years old', widget.render({user: {name: "Ivan", age: 14}}));

        // Changing state:
        widget.api().change();
        assert.equal('His name is <b>Andrey</b> and he is 28 years old', widget.render());
    });

    it('should share state between widgets if compiler configured to work with shared state', () => {
        let c = new Compiler({state: "shared"});
        let widget = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b> and he is {$user.age} years old,
                    {include:test_inclusion}
                `,
                init: function(internal) {

                    internal.includes = {
                        "test_inclusion": require("../src/app/test_inclusion")
                    }

                    internal.api.change_parent = function() {
                        internal.state.user.name = "Andrey";
                        internal.state.user.age = 28;
                        internal.refresh();
                    }

                    internal.api.change_child = function() {
                        internal.includes.test_inclusion.change("Nikolay", 32);
                    }
                }
            }
        );

        // no state at all:
        assert.equal(
            'His name is <b>null</b> and he is null years old, His name is <b>null</b> and he is null years old',
            widget.render()
        );

        // forced state:
        assert.equal(
            'His name is <b>Ivan</b> and he is 14 years old, His name is <b>Ivan</b> and he is 14 years old',
            widget.render({user: {name: "Ivan", age: 14}}));

        // Changing state of parent widget:
        widget.api().change_parent();
        assert.equal(
            'His name is <b>Andrey</b> and he is 28 years old, His name is <b>Andrey</b> and he is 28 years old',
            widget.render()
        );

        // Changing state of child widget:
        widget.api().change_child();
        assert.equal(
            'His name is <b>Nikolay</b> and he is 32 years old, His name is <b>Nikolay</b> and he is 32 years old',
            widget.render()
        );
    });

    it('should NOT share state between widgets if compiler configured to work with local state', () => {
        let c = new Compiler({state: "local"});

        let widget = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b> and he is {$user.age} years old,
                    {include:test_inclusion}
                `,
                init: function(internal) {

                    internal.includes = {
                        "test_inclusion": require("../src/app/test_inclusion")
                    }

                    internal.api.get_state_from_parent = function() {
                        return internal.state;
                    }

                    internal.api.get_state_from_child = function() {
                        return internal.includes.test_inclusion.get_state();
                    }

                    internal.api.change_parent = function() {
                        internal.state.user.name = "Andrey";
                        internal.state.user.age = 28;
                        internal.refresh();
                    }

                    internal.api.change_child = function() {
                        internal.includes.test_inclusion.change("Nikolay", 32);
                    }
                }
            }
        );

        // no state at all:
        assert.equal(
            'His name is <b>null</b> and he is null years old, His name is <b>null</b> and he is null years old',
            widget.render()
        );

        // forced state:
        assert.equal(
            'His name is <b>Ivan</b> and he is 14 years old, His name is <b>Ivan</b> and he is 14 years old',
            widget.render({user: {name: "Ivan", age: 14}})
        );

        // Changing state of parent widget:
        widget.api().change_parent();

        assert.equal(
            'His name is <b>Andrey</b> and he is 28 years old, His name is <b>Andrey</b> and he is 28 years old',
            widget.render()
        );

        // Changing state of child widget:
        widget.api().change_child();

        // Child has a new state, while parent still has an old version:
        assert.deepEqual({user: {name: 'Andrey', age: 28}}, widget.api().get_state_from_parent());
        assert.deepEqual({user: {name: 'Nikolay', age: 32}, local_property: "xxx"}, widget.api().get_state_from_child());

        // But when we call render() parent widget delegates it's version of the state to the child:
        assert.equal(
            'His name is <b>Andrey</b> and he is 28 years old, His name is <b>Andrey</b> and he is 28 years old',
            widget.render()
        );

        // So child's state has been changed back, but the property 'local_property' remained in the child's state:
        assert.deepEqual({user: {name: 'Andrey', age: 28}}, widget.api().get_state_from_parent());
        assert.deepEqual({user: {name: 'Andrey', age: 28}, local_property: "xxx"}, widget.api().get_state_from_child());
    });


});
