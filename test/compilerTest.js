var assert = require('assert');

import {Application,Widget} from "../src/classes/Application";


describe('Application', () => {

    let c = new Application();

    it('should compile template into class Widget', () => {
        let widget = c.compile({template: 'anything'});
        assert(widget instanceof Widget);
    });

    it('should render widget correctly according to the data', () => {
        let widget = c.compile(
            {template: 'His name is <b>{$user.name}</b> and he is {$user.age} years old'},
            {user: {name: "Andrey", age: 28}}
        );
        assert.equal('His name is <b>Andrey</b> and he is 28 years old', widget.render());
    });

    it('should use default value for variable if there is required variable is not present in data', () => {
        let widget = c.compile(
            {template: 'His name is <b>{$user.name}</b> and he is {$user.age || 18} years old'},
            {user: {name: "Andrey"}}
        );
        assert.equal('His name is <b>Andrey</b> and he is 18 years old', widget.render());
    });

    it('should support ternary operator for variables', () => {
        let widget1 = c.compile(
            {template: 'His name is <b>{$user.name}</b> and he is {$user.age < 18 ? young : old}'},
            {user: {name: "Andrey", age: 14}}
        );
        assert.equal('His name is <b>Andrey</b> and he is young', widget1.render());

        let widget2 = c.compile(
            {template: 'His name is <b>{$user.name}</b> and he is {$user.age < 18 ? young : old}'},
            {user: {name: "Andrey", age: 28}}
        );
        assert.equal('His name is <b>Andrey</b> and he is old', widget2.render());
    });

    it('should support ternary operator for variables (short version)', () => {
        let widget1 = c.compile(
            {
                template: 'His name is <b>{$user.name}</b> {$user.age < 18 ? and he is young}'
            },
            {user: {name: "Andrey", age: 14}}
        );
        assert.equal('His name is <b>Andrey</b> and he is young', widget1.render());

        let widget2 = c.compile(
            {
                template: 'His name is <b>{$user.name}</b> {$user.age < 18 ? and he is young}'
            },
            {user: {name: "Andrey", age: 28}}
        );
        assert.equal('His name is <b>Andrey</b> ', widget2.render());
    });

    it('should support ternary operator with conjunctions', () => {
        let widget1 = c.compile(
            {
                template: 'His name is <b>{$user.name}</b> {($user.age < 18) && ($user.age > 10) ? and he is teenager}'
            },
            {user: {name: "Andrey", age: 14}}
        );
        assert.equal('His name is <b>Andrey</b> and he is teenager', widget1.render());

        let widget2 = c.compile(
            {
                template: 'His name is <b>{$user.name}</b> {($user.age < 18) && ($user.age > 10) ? and he is teenager}'
            },
            {user: {name: "Andrey", age: 28}}
        );
        assert.equal('His name is <b>Andrey</b> ', widget2.render());
    });

    it('should support ternary operator with disjunctions', () => {
        let widget1 = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b> and he is {($user.age < $target || $user.age > $target) ? not} {$target} years old
                `
            },
            {user: {name: "Andrey", age: 14}, target: 42}
        );
        assert.equal('His name is <b>Andrey</b> and he is not 42 years old', widget1.render());

        let widget2 = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b> and he is {($user.age < $target || $user.age > $target) ? not} {$target} years old
                `
            },
            {user: {name: "Andrey", age: 42}, target: 42}
        );
        assert.equal('His name is <b>Andrey</b> and he is 42 years old', widget2.render());
    });

    it('should support ternary operator with variables in true/false expressions', () => {
        let widget1 = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b> and he is {$user.age == $target ? $target years old : not $target years old}
                `
            },
            {user: {name: "Andrey", age: 14}, target: 42}
        );
        assert.equal('His name is <b>Andrey</b> and he is not 42 years old', widget1.render());

        let widget2 = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b> and he is {$user.age == $target ? $target years old : not $target years old}
                `
            },
            {user: {name: "Andrey", age: 42}, target: 42}
        );
        assert.equal('His name is <b>Andrey</b> and he is 42 years old', widget2.render());
    });

    it('should support full and short syntax for if/else (multiline)', () => {
        let widget1 = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b>
                    {$user.age != null ?
                        and we know how old is he
                    }
                `
            },
            {user: {name: "Andrey", age: 14}}
        );
        assert.equal(
            'His name is <b>Andrey</b> and we know how old is he',
            widget1.render()
        );

        let widget2 = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b>
                    {$user.age != null
                        ? and we know how old is he ($user.age)
                        : and we don't know how old is he ($user.age || unknown)
                    }
                `
            },
            {user: {name: "Andrey"}}
        );
        assert.equal(
            `His name is <b>Andrey</b> and we don\'t know how old is he (unknown)`,
            widget2.render()
        );
    });

    it('should support iterations over lists', () => {
        let widget = c.compile(
            {
                template: `
                    There were 3 students in the class:<br />
                    {for $student in $students
                        $i) $student.name - $student.age<br />
                    }
                `
            },
            {
                students: [
                    {name: "Andrey", age: 28},
                    {name: "Alex", age: 19},
                    {name: "Ivan", age: 42}
                ]
            }
        );
        assert.equal(
            'There were 3 students in the class:<br /> 1) Andrey - 28<br />2) Alex - 19<br />3) Ivan - 42<br />',
            widget.render()
        );
    });

    it('should support conditions and other syntax inside lists', () => {
        let widget = c.compile(
            {
                template: `
                    There were 3 students in the class:<br />
                    {for $student in $students
                        {$student.age > 20 ?
                            $i) $student.name - $student.age - ($global_var)<br />
                        }
                    }
                `
            },
            {
                students: [
                    {name: "Andrey", age: 28},
                    {name: "Alex", age: 19},
                    {name: "Ivan", age: 42}
                ],
                global_var: "@"
            }
        );
        assert.equal(
            'There were 3 students in the class:<br /> 1) Andrey - 28 - (@)<br />2) Ivan - 42 - (@)<br />',
            widget.render()
        );
    });

    it('should support include syntax', () => {
        let c = new Application();

        let testInclusion = {"template": `His name is <b>{$user.name}</b> and he is {$user.age} years old`}

        let widget = c.compile(
            {template: `PREFIX-{include:inclusion_name}-SUFFIX`}, {user: {name: "Andrey", age: 28}}, {
                "inclusion_name": testInclusion
            }
        );
        assert.equal('PREFIX-His name is <b>Andrey</b> and he is 28 years old-SUFFIX', widget.render());
    });

    it('should support include syntax with variables', () => {
        let c = new Application();

        let digit = {"template": `{$digit}`}

        let widget = c.compile(
            {template: `PREFIX-{for $d in [1,2,3] {include:digit with {"digit": $d}}-}SUFFIX`}, {}, {
                "digit": digit
            }
        );
        assert.equal('PREFIX-1-2-3-SUFFIX', widget.render());
    });

    it('should support include syntax with dynamic inclusion name', () => {
        let c = new Application();

        let digit = {"template": `{$digit}`}

        let widget = c.compile(
            {
                template: `PREFIX-{for $d in [1,2,3] {include:$includeName with {"digit": $d}}-}SUFFIX`},
                {"includeName": "digit"},
                {"digit": digit}
        );
        assert.equal('PREFIX-1-2-3-SUFFIX', widget.render());
    });

    it('should support rebuild syntax', () => {
        let c = new Application();

        let baseTemplate = {
            "template": `PREFIX-{$content || DEFAULT-CONTENT}-SUFFIX-{$fixed || ENDING}`
        }

        let baseWidget = c.compile(
            {template: `{include:base_template}`}, {}, {
                "base_template": baseTemplate
            }
        );

        assert.equal('PREFIX-DEFAULT-CONTENT-SUFFIX-ENDING', baseWidget.render());

        let rebasedWidget = c.compile(
            {template: `{rebuild:base_template with {"content": "REBASED-CONTENT", "blablatag": "222"}}`}, {}, {
                "base_template": baseTemplate
            }
        );
        assert.equal('PREFIX-REBASED-CONTENT-SUFFIX-ENDING', rebasedWidget.render());
    });

    it('should support rebuild syntax with curly braces instead of quotes', () => {
        let c = new Application();

        let baseTemplate = {
            "template": `PREFIX-{$content || DEFAULT-CONTENT}-SUFFIX-{$fixed || ENDING}`
        }

        let rebasedWidget = c.compile(
            {template: `{rebuild:base_template with {content:REBASED-CONTENT}, {blablatag:222}}`}, {}, {
                "base_template": baseTemplate
            }
        );
        assert.equal('PREFIX-REBASED-CONTENT-SUFFIX-ENDING', rebasedWidget.render());
    });


});
