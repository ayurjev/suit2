var assert = require('assert');

import {Compiler,Widget} from "../src/classes/Compiler";

describe('Compiler', () => {

    let c = new Compiler();

    it('should compile template into class Widget', () => {
        let widget = c.compile('anything');
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

    it('should support ternary operator for variables', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> and he is {$user.age < 18 ? young : old}');
        assert.equal(
            'His name is <b>Andrey</b> and he is young',
            widget.render({user: {name: "Andrey", age: 14}})
        );
        assert.equal(
            'His name is <b>Andrey</b> and he is old',
            widget.render({user: {name: "Andrey", age: 28}})
        );
    });

    it('should support ternary operator for variables (short version)', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> {$user.age < 18 ? and he is young}');
        assert.equal(
            'His name is <b>Andrey</b> and he is young',
            widget.render({user: {name: "Andrey", age: 14}})
        );
        assert.equal(
            'His name is <b>Andrey</b> ',
            widget.render({user: {name: "Andrey", age: 28}})
        );
    });

    it('should support ternary operator with conjunctions', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> {($user.age < 18 && $user.age > 10) ? and he is teenager}');
        assert.equal(
            'His name is <b>Andrey</b> and he is teenager',
            widget.render({user: {name: "Andrey", age: 14}})
        );
        assert.equal(
            'His name is <b>Andrey</b> ',
            widget.render({user: {name: "Andrey", age: 28}})
        );
    });

    it('should support ternary operator with disjunctions', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> and he is {($user.age < $target || $user.age > $target) ? not} {$target} years old');
        assert.equal(
            'His name is <b>Andrey</b> and he is not 42 years old',
            widget.render({user: {name: "Andrey", age: 14}, target: 42})
        );
        assert.equal(
            'His name is <b>Andrey</b> and he is 42 years old',
            widget.render({user: {name: "Andrey", age: 42}, target: 42})
        );
    });

    it('should support ternary operator with variables in true/false expressions', () => {
        let widget = c.compile('His name is <b>{$user.name}</b> and he is {$user.age == $target ? $target years old : not $target years old}');
        assert.equal(
            'His name is <b>Andrey</b> and he is not 42 years old',
            widget.render({user: {name: "Andrey", age: 14}, target: 42})
        );
        assert.equal(
            'His name is <b>Andrey</b> and he is 42 years old',
            widget.render({user: {name: "Andrey", age: 42}, target: 42})
        );
    });

    it('should support full and short syntax for if/else (multiline)', () => {
        let widget1 = c.compile(`
            His name is <b>{$user.name}</b>
            {$user.age != null ?
                and we know how old is he
            }
        `);
        assert.equal(
            'His name is <b>Andrey</b> and we know how old is he',
            widget1.render({user: {name: "Andrey", age: 14}})
        );

        let widget2 = c.compile(`
            His name is <b>{$user.name}</b>
            {$user.age != null
                ? and we know how old is he ($user.age)
                : and we don't know how old is he ($user.age || unknown)
            }
        `);
        assert.equal(
            `His name is <b>Andrey</b> and we don\'t know how old is he (unknown)`,
            widget2.render({user: {name: "Andrey"}})
        );
    });

    it('should support iterations over lists', () => {
        let widget = c.compile(`
            There were 3 students in the class:<br />
            {for $student in $students
                $i) $student.name - $student.age<br />
            }
        `);
        assert.equal(
            'There were 3 students in the class:<br /> 1) Andrey - 28<br />2) Alex - 19<br />3) Ivan - 42<br />',
            widget.render({
                students: [
                    {name: "Andrey", age: 28},
                    {name: "Alex", age: 19},
                    {name: "Ivan", age: 42}
                ]
            })
        );
    });

    it('should support conditions and other syntax inside lists', () => {
        let widget = c.compile(`
            There were 3 students in the class:<br />
            {for $student in $students
                {$student.age > 20 ?
                    $i) $student.name - $student.age - ($global_var)<br />
                }
            }
        `);
        assert.equal(
            'There were 3 students in the class:<br /> 1) Andrey - 28 - (@)<br />3) Ivan - 42 - (@)<br />',
            widget.render({
                students: [
                    {name: "Andrey", age: 28},
                    {name: "Alex", age: 19},
                    {name: "Ivan", age: 42}
                ],
                global_var: "@"
            })
        );
    });

});
