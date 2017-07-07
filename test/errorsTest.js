var assert = require('assert');

import {
    Application,Widget,
    UnbalancedBracketsError,
    WidgetNotFoundError
} from "../src/classes/Application";


describe('Compiler', () => {

    let c = new Application();

    it('should tell us if template has unbalanced brackets', () => {
        assert.throws(() => {
            c.compile({template: 'His name is <b>{$user.name}</b> and he is {$user.age years old'});
        }, UnbalancedBracketsError);
    });

    it('should tell us if we forgot to define includes correctly', () => {
        assert.throws(() => {
            let widget = c.compile(
                {template: '{rebuild:bootstrap with {"content": "REBASED-CONTENT"}}'},
                {}, // state is empty, doesn't matter...
                {}, // includes are empty, so no bootstrap widget can be found...
            );
            widget.render();
        }, WidgetNotFoundError);
    });

});
