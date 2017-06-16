var assert = require('assert');

import {Compiler,Widget} from "../src/classes/Compiler";


describe('Widget', () => {

    let c = new Compiler();

    it('should have default api() method', () => {
        let widget = c.compile(
            {template: 'anything'}
        );
        // check widget's api:
        assert(widget.api()["createListeners"] instanceof Function);
        assert(widget.api()["uid"] instanceof Function);
    });

    it('should convert internal inclusions into widgets api', () => {
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

    




});
