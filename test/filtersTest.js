var assert = require('assert');

import {Application} from "../src/classes/Application";
import {Component} from "../src/classes/Component";


describe('Application', () => {

    let app = new Application();


    it('should support "json" filter', () => {

        class TestComponent1 extends Component {
            template() { return `{$user}!`; }
        }
        let component1 = app.createComponent(TestComponent1);
        assert.equal(`[object Object]!`, component1.render({user: {name: "Andrey"}}));

        class TestComponent2 extends Component {
            template() { return `{$user|json()}!`; }
        }
        let component2 = app.createComponent(TestComponent2);
        assert.equal(`{"name":"Andrey"}!`, component2.render({user: {name: "Andrey"}}));
    });


    it('should support "length" filter', () => {

        class TestComponent extends Component {
            template() { return `Length of his name equals {$user.name|length()}!`; }
        }

        let component = app.createComponent(TestComponent);

        assert.equal('Length of his name equals 6!', component.render({user: {name: "Andrey"}}));
        assert.equal('Length of his name equals 0!', component.render({user: {}}));
        assert.equal('Length of his name equals 6!', component.render({user: {name: ["A", "n", "d", "r", "e", "y"]}}));
        assert.equal('Length of his name equals 6!', component.render({user: {name: {"A": 1, "n": 2, "d": 3, "r": 4, "e": 5, "y": 6}}}));
        assert.equal('Length of his name equals 0!', component.render({user: {name: false}}));
        assert.equal('Length of his name equals 0!', component.render({user: {name: null}}));
        assert.equal('Length of his name equals 1!', component.render({user: {name: true}}));
    });


    it('should support "exists" filter', () => {

        class TestComponent extends Component {
            template() { return `{$user.name|exists()}`; }
        }

        let component = app.createComponent(TestComponent);

        assert.equal('true', component.render({user: {name: "Andrey"}}));
        assert.equal('false', component.render({user: {}}));
        assert.equal('true', component.render({user: {name: ["A", "n", "d", "r", "e", "y"]}}));
        assert.equal('true', component.render({user: {name: {"A": 1, "n": 2, "d": 3, "r": 4, "e": 5, "y": 6}}}));
        assert.equal('false', component.render({user: {name: false}}));
        assert.equal('false', component.render({user: {name: null}}));
        assert.equal('true', component.render({user: {name: true}}));
    });


    it('should support "length" filter inside conditional blocks', () => {

        class TestComponent extends Component {
            template() {
                return `
                    His name is <b>{$user.name}</b>
                    {$user.name|length() != 6
                        ? and length of his name does not equal 6
                        : and length of his name equals 6!
                    }
                `;
            }
        }

        let component = app.createComponent(TestComponent);

        assert.equal(
            'His name is <b>Andrey</b> and length of his name equals 6!',
            component.render({user: {name: "Andrey"}})
        );

    });


    it('should support "starstwith" filter', () => {

        class TestComponent extends Component {
            template() {
                return `
                    {$user.name|startswith("And")
                        ? His name starts with "And"
                        : His name does not start with "And"
                    }
                `;
            }
        }

        let component = app.createComponent(TestComponent);

        assert.equal(
            'His name starts with "And"',
            component.render({user: {name: "Andrey"}})
        );

        assert.equal(
            'His name does not start with "And"',
            component.render({user: {name: "Ivan"}})
        );

    });


    it('should support "endswith" filter', () => {

        class TestComponent extends Component {
            template() {
                return `
                    {$user.name|endswith("rey")
                        ? His name ends with "rey"
                        : His name does not end with "rey"
                    }
                `;
            }
        }

        let component = app.createComponent(TestComponent);

        assert.equal(
            'His name ends with "rey"',
            component.render({user: {name: "Andrey"}})
        );

        assert.equal(
            'His name does not end with "rey"',
            component.render({user: {name: "Ivan"}})
        );

    });


    it('should support "format" filter', () => {

        class TestComponent extends Component {
            template() {
                return `He was born {$user.birthdate|format("%d.%m.%Y")}`;
            }
        }

        let component = app.createComponent(TestComponent);

        assert.equal(
            'He was born 08.09.1988',
            component.render({user: {birthdate: new Date(1988, 8, 8)}})
        );

    });


    it('should support "in" filter', () => {

        class TestComponent extends Component {
            template() {
                return `
                    {$user.name|in($coolNames)
                        ? $user.name is a cool name
                        : $user.name is not a cool name
                    }
                `;
            }
        }

        let component = app.createComponent(TestComponent);

        assert.equal(
            'Andrey is a cool name',
            component.render({user: {name: "Andrey"}, coolNames: ["Andrey", "Nikolay"]})
        );

        assert.equal(
            'BRWYRWYR is not a cool name',
            component.render({user: {name: "BRWYRWYR"}, coolNames: ["Andrey", "Nikolay"]})
        );

    });


    it('should support "contains" filter', () => {

        class TestComponent extends Component {
            template() {
                return `
                    {$coolNames|contains($user.name)
                        ? $user.name is a cool name
                        : $user.name is not a cool name
                    }
                `;
            }
        }

        let component = app.createComponent(TestComponent);

        assert.equal(
            'Andrey is a cool name',
            component.render({user: {name: "Andrey"}, coolNames: ["Andrey", "Nikolay"]})
        );

        assert.equal(
            'BRWYRWYR is not a cool name',
            component.render({user: {name: "BRWYRWYR"}, coolNames: ["Andrey", "Nikolay"]})
        );
    });


    it('should support "pluralform" filter', () => {

        class TestComponent extends Component {
            template() {
                return `
                    {for $age in $ages
                        $age|pluralform(["год","года","лет"]),
                    }
                `;
            }
        }

        let component = app.createComponent(TestComponent);

        assert.equal(
            '1 год,2 года,3 года,4 года,5 лет,11 лет,42 года,45 лет,',
            component.render({ages: [1, 2, 3, 4, 5, 11, 42, 45]})
        );
    });

    // TODO: auto-escaping is disabled because of some problems with rebuild syntax...
    // it('should support "html" filter and escape characters by default', () => {
    //
    //     class TestComponent1 extends Component {
    //         template() {
    //             return `{$html}`;
    //         }
    //     }
    //
    //     let component1 = app.createComponent(TestComponent1);
    //     assert.equal('&lt;p&gt;test&lt;&#x2F;p&gt;', component1.render({html: "<p>test</p>"}));
    //
    //     class TestComponent2 extends Component {
    //         template() {
    //             return `{$html|html()}`;
    //         }
    //     }
    //
    //     let component2 = app.createComponent(TestComponent2);
    //     assert.equal('<p>test</p>', component2.render({html: "<p>test</p>"}));
    //
    // });

});
