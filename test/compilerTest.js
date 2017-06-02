var assert = require('assert');

import {Compiler,Widget} from "../src/classes/Compiler";

describe('Compiler', () => {

    let c = new Compiler();

    it('should compile template into class Widget', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> and he is {$user.age} years old');
        assert(widget instanceof Widget);
    });

    it('should render widget correctly according to the data', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> and he is {$user.age} years old');
        assert.equal(
            'His name is <b>Andrey</b> and he is 28 years old',
            widget.render({user: {name: "Andrey", age: 28}})
        );
    });

    it('should use default value for variable if there is required variable is not present in data', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> and he is {$user.age || 18} years old');
        assert.equal(
            'His name is <b>Andrey</b> and he is 18 years old',
            widget.render({user: {name: "Andrey"}})
        );
    });

});
