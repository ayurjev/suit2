var assert = require('assert');

import {Compiler,Widget} from "../src/classes/Compiler";


describe('Compiler', () => {

    let c = new Compiler();

    it('should support "length" filter', () => {
        let widget = c.compile(
            {template: `Length of his name equals {$user.name|length()}!`},
            {user: {name: "Andrey"}}
        );
        assert.equal(
            'Length of his name equals 6!',
            widget.render()
        );
    });

    it('should support "length" filter inside conditional blocks', () => {
        let widget = c.compile(
            {
                template: `
                    His name is <b>{$user.name}</b>
                    {$user.name|length != 6
                        ? and length of his name does not equal 6
                        : and length of his name equals 6!
                    }
                `
            },
            {user: {name: "Andrey"}}
        );
        assert.equal(
            'His name is <b>Andrey</b> and length of his name equals 6!',
            widget.render()
        );
    });

    it('should support "starstwith" filter', () => {
        let widget1 = c.compile(
            {
                template: `
                    {$user.name|startswith("And")
                        ? His name starts with "And"
                        : His name does not start with "And"
                    }
                `
            },
            {user: {name: "Andrey"}}
        );
        assert.equal(
            'His name starts with "And"',
            widget1.render()
        );

        let widget2 = c.compile(
            {
                template: `
                    {$user.name|startswith("And")
                        ? His name starts with "And"
                        : His name does not start with "And"
                    }
                `
            },
            {user: {name: "Ivan"}}
        );
        assert.equal(
            'His name does not start with "And"',
            widget2.render()
        );
    });

    it('should support "endswith" filter', () => {
        let widget1 = c.compile(
            {
                template: `
                    {$user.name|endswith("rey")
                        ? His name ends with "rey"
                        : His name does not end with "rey"
                    }
                `
            },
            {user: {name: "Andrey"}}
        );
        assert.equal(
            'His name ends with "rey"',
            widget1.render()
        );

        let widget2 = c.compile(
            {
                template: `
                    {$user.name|endswith("rey")
                        ? His name ends with "rey"
                        : His name does not end with "rey"
                    }
                `
            },
            {user: {name: "Ivan"}}
        );
        assert.equal(
            'His name does not end with "rey"',
            widget2.render()
        );
    });

    it('should support "format" filter', () => {
        let widget = c.compile(
            {template: `He was born {$user.birthdate|format("%d.%m.%Y")}`},
            {user: {birthdate: new Date(1988, 8, 8)}}
        );
        assert.equal(
            'He was born 08.09.1988',
            widget.render()
        );
    });

    it('should support "in" filter', () => {
        let widget1 = c.compile(
            {template: `
                {$user.name|in($coolNames)
                    ? $user.name is cool name
                    : $user.name is not cool name
                }`

            },
            {user: {name: "Andrey"}, coolNames: ["Andrey", "Nikolay"]}
        );

        assert.equal(
            'Andrey is cool name',
            widget1.render()
        );

        let widget2 = c.compile(
            {template: `
                {$user.name|in($coolNames)
                    ? $user.name is cool name
                    : $user.name is not cool name
                }`

            },
            {user: {name: "BRWYRWYR"}, coolNames: ["Andrey", "Nikolay"]}
        );

        assert.equal(
            'BRWYRWYR is not cool name',
            widget2.render()
        );
    });

    it('should support "contains" filter', () => {
        let widget1 = c.compile(
            {template: `
                {$coolNames|contains($user.name)
                    ? $user.name is cool name
                    : $user.name is not cool name
                }`

            },
            {user: {name: "Andrey"}, coolNames: ["Andrey", "Nikolay"]}
        );

        assert.equal(
            'Andrey is cool name',
            widget1.render()
        );

        let widget2 = c.compile(
            {template: `
                {$coolNames|contains($user.name)
                    ? $user.name is cool name
                    : $user.name is not cool name
                }`

            },
            {user: {name: "BRWYRWYR"}, coolNames: ["Andrey", "Nikolay"]}
        );

        assert.equal(
            'BRWYRWYR is not cool name',
            widget2.render()
        );
    });

    it('should support "pluralform" filter', () => {
        let widget = c.compile(
            {
                template: `
                    {for $age in $ages
                        $age|pluralform(["год","года","лет"]),
                    }
                `
            },
            {ages: [1, 2, 3, 4, 5, 11, 42, 45]}
        );

        assert.equal(
            '1 год,2 года,3 года,4 года,5 лет,11 лет,42 года,45 лет,',
            widget.render()
        );
    });

    it('should support "html" filter and escape characters by default', () => {
        let widget1 = c.compile(
            {template: `{$html}`},
            {html: "<p>test</p>"}
        );

        assert.equal('&lt;p&gt;test&lt;&#x2F;p&gt;', widget1.render());

        let widget = c.compile(
            {template: `{$html|html()}`},
            {html: "<p>test</p>"}
        );

        assert.equal('<p>test</p>', widget.render());
    });

});
