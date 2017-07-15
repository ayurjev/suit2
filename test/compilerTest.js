var assert = require('assert');

import {Application} from "../src/classes/Application";
import {Component} from "../src/classes/Component";


describe('Application', () => {

    let app = new Application();


    it('should compile template into class Component', () => {

        class TestComponent extends Component {
            template() { return 'anything'; }
        }

        let component = app.component(TestComponent);

        assert(component instanceof Component);
    });


    it('should render component correctly according to the data', () => {

        class TestComponent extends Component {
            template() { return 'His name is <b>{$user.name}</b> and he is {$user.age} years old'; }
        }

        let component = app.component(TestComponent, {user: {name: "Andrey", age: 28}});

        assert.equal('His name is <b>Andrey</b> and he is 28 years old', component.render());
    });


    it('should use default value for variable if there is required variable is not present in data', () => {

        class TestComponent extends Component {
            template() { return 'His name is <b>{$user.name}</b> and he is {$user.age || 18} years old'; }
        }

        let component = app.component(TestComponent, {user: {name: "Andrey"}});

        assert.equal('His name is <b>Andrey</b> and he is 18 years old', component.render());
    });


    it('should support ternary operator for variables', () => {

        class TestComponent extends Component {
            template() { return 'His name is <b>{$user.name}</b> and he is {$user.age < 18 ? young : old}'; }
        }

        let component = app.component(TestComponent);

        assert.equal('His name is <b>Andrey</b> and he is young', component.render({user: {name: "Andrey", age: 14}}));
        assert.equal('His name is <b>Andrey</b> and he is old', component.render({user: {name: "Andrey", age: 28}}));
    });


    it('should support ternary operator for variables (short version)', () => {

        class TestComponent extends Component {
            template() { return 'His name is <b>{$user.name}</b> {$user.age < 18 ? and he is young}'; }
        }

        let component = app.component(TestComponent);

        assert.equal('His name is <b>Andrey</b> and he is young', component.render({user: {name: "Andrey", age: 14}}));
        assert.equal('His name is <b>Andrey</b> ', component.render({user: {name: "Andrey", age: 28}}));
    });


    it('should support ternary operator with conjunctions', () => {

        class TestComponent extends Component {
            template() { return 'His name is <b>{$user.name}</b> {($user.age < 18) && ($user.age > 10) ? and he is teenager}'; }
        }

        let component = app.component(TestComponent);

        assert.equal('His name is <b>Andrey</b> and he is teenager', component.render({user: {name: "Andrey", age: 14}}));
        assert.equal('His name is <b>Andrey</b> ', component.render({user: {name: "Andrey", age: 28}}));
    });


    it('should support ternary operator with disjunctions', () => {

        class TestComponent extends Component {
            template() {
                return  `
                    His name is <b>{$user.name}</b> and he is {($user.age < $target || $user.age > $target) ? not} {$target} years old
                `;
            }
        }
        let component = app.component(TestComponent);

        assert.equal(
            'His name is <b>Andrey</b> and he is not 42 years old',
            component.render({user: {name: "Andrey", age: 14}, target: 42})
        );

        assert.equal(
            'His name is <b>Andrey</b> and he is 42 years old',
            component.render({user: {name: "Andrey", age: 42}, target: 42})
        );
    });


    it('should support ternary operator with variables in true/false expressions', () => {

        class TestComponent extends Component {
            template() {
                return  `
                    His name is <b>{$user.name}</b> and he is {$user.age == $target ? $target years old : not $target years old}
                `;
            }
        }
        let component = app.component(TestComponent);

        assert.equal(
            'His name is <b>Andrey</b> and he is not 42 years old',
            component.render({user: {name: "Andrey", age: 14}, target: 42})
        );

        assert.equal(
            'His name is <b>Andrey</b> and he is 42 years old',
            component.render({user: {name: "Andrey", age: 42}, target: 42})
        );
    });


    it('should support full and short syntax for if/else (multiline)', () => {

        class TestComponent extends Component {
            template() {
                return  `
                    His name is <b>{$user.name}</b>
                    {$user.age != null ?
                        and we know how old is he
                    }
                `;
            }
        }
        let component1 = app.component(TestComponent);

        assert.equal(
            'His name is <b>Andrey</b> and we know how old is he',
            component1.render({user: {name: "Andrey", age: 14}})
        );

        class TestComponent2 extends Component {
            template() {
                return `
                    His name is <b>{$user.name}</b>
                    {$user.age != null
                        ? and we know how old is he ($user.age)
                        : and we don't know how old is he ($user.age || unknown)
                    }
                `;
            }
        }

        let component2 = app.component(TestComponent2);

        assert.equal(
            `His name is <b>Andrey</b> and we don\'t know how old is he (unknown)`,
            component2.render({user: {name: "Andrey"}})
        );
    });


    it('should support iterations over lists', () => {

        class TestComponent extends Component {
            template() {
                return  `
                    There were 3 students in the class:<br />
                    {for $student in $students
                        $i) $student.name - $student.age<br />
                    }
                `;
            }
        }
        let component = app.component(TestComponent);

        assert.equal(
            'There were 3 students in the class:<br /> 1) Andrey - 28<br />2) Alex - 19<br />3) Ivan - 42<br />',
            component.render({
                students: [
                    {name: "Andrey", age: 28},
                    {name: "Alex", age: 19},
                    {name: "Ivan", age: 42}
                ]
            })
        );
    });


    it('should support conditions and other syntax inside lists', () => {

        class TestComponent extends Component {
            template() {
                return  `
                    There were 3 students in the class:<br />
                    {for $student in $students
                        {$student.age > 20 ?
                            $i) $student.name - $student.age - ($global_var)<br />
                        }
                    }
                `;
            }
        }

        let component = app.component(TestComponent);

        assert.equal(
            'There were 3 students in the class:<br /> 1) Andrey - 28 - (@)<br />2) Ivan - 42 - (@)<br />',
            component.render({
                students: [
                    {name: "Andrey", age: 28},
                    {name: "Alex", age: 19},
                    {name: "Ivan", age: 42}
                ],
                global_var: "@"
            })
        );
    });


    it('should support include syntax', () => {

        class TestInclusion extends Component {
            template() {
                return `His name is <b>{$user.name}</b> and he is {$user.age} years old`;
            }
        }

        class TestComponent extends Component {
            template() {
                return `PREFIX-{include:inclusion_name}-SUFFIX`;
            }
        }

        let component = app.component(TestComponent, {user: {name: "Andrey", age: 28}}, {"inclusion_name": TestInclusion});

        assert.equal('PREFIX-His name is <b>Andrey</b> and he is 28 years old-SUFFIX', component.render());
    });


    it('should support include syntax with variables', () => {

        class DigitComponent extends Component {
            template() { return `{$digit}`}
        }

        class TestComponent extends Component {
            template() {
                return `PREFIX-{for $d in [1,2,3] {include:digit with {"digit": $d}}-}SUFFIX`;
            }
        }

        let component = app.component(TestComponent, {}, {"digit": DigitComponent});

        assert.equal('PREFIX-1-2-3-SUFFIX', component.render());
    });


    it('should support include syntax with dynamic inclusion name', () => {

        class DigitComponent extends Component {
            template() { return `{$digit}`}
        }

        class TestComponent extends Component {
            template() {
                return `PREFIX-{for $d in [1,2,3] {include:$includeName with {"digit": $d}}-}SUFFIX`;
            }
        }

        let component = app.component(TestComponent, {"includeName": "digit"}, {"digit": DigitComponent});

        assert.equal('PREFIX-1-2-3-SUFFIX', component.render());
    });


    it('should support rebuild syntax', () => {

        class BaseComponent extends Component {
            template() { return `PREFIX-{$content || DEFAULT-CONTENT}-SUFFIX-{$fixed || ENDING}`}
        }

        class TestComponent extends Component {
            template() {
                return `{include:base_template}`;
            }
        }

        class RebasedComponent extends Component {
            template() {
                return `{rebuild:base_template with {"content": "REBASED-CONTENT", "blablatag": "222"}}`;
            }
        }

        let baseComponent = app.component(TestComponent, {}, {"base_template": BaseComponent});
        assert.equal('PREFIX-DEFAULT-CONTENT-SUFFIX-ENDING', baseComponent.render());

        let rebasedComponent = app.component(RebasedComponent, {}, {"base_template": BaseComponent});
        assert.equal('PREFIX-REBASED-CONTENT-SUFFIX-ENDING', rebasedComponent.render());
    });


    it('should support rebuild syntax with curly braces instead of quotes', () => {

        class BaseComponent extends Component {
            template() { return `PREFIX-{$content || DEFAULT-CONTENT}-SUFFIX-{$fixed || ENDING}`}
        }

        class RebasedComponent extends Component {
            template() {
                return `{rebuild:base_template with {content:REBASED-CONTENT}, {blablatag:222}}`;
            }
        }

        let rebasedComponent = app.component(RebasedComponent, {}, {"base_template": BaseComponent});
        assert.equal('PREFIX-REBASED-CONTENT-SUFFIX-ENDING', rebasedComponent.render());
    });

});
