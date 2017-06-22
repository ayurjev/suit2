var assert = require('assert');

import {Compiler,Widget} from "../src/classes/Compiler";


describe('Router', () => {

    it('should select correct controller for clean urls and url with parameters', () => {
        let c = new Compiler({
            "/page1/": require("../src/app/test_inclusion"),
            "/page1/subpage/": require("../src/app/subpage"),
            "/page1/subpage/<name>/": require("../src/app/subpage"),
            "/<any>/": require("../src/app/digit"),
        });

        assert.throws(() => { c.getLoadTarget("/") }, Error, "404 NotFound");
        assert.equal(require("../src/app/test_inclusion"), c.getLoadTarget("/page1/").controller);
        assert.equal(require("../src/app/subpage"), c.getLoadTarget("/page1/subpage/").controller);
        assert.equal(require("../src/app/subpage"), c.getLoadTarget("/page1/subpage/andrey/").controller);
        assert.equal(require("../src/app/digit"), c.getLoadTarget("/page2/").controller);
    });

    it('should select correct controller despite usage of trailing slashes', () => {
        // routes are defined without trailing slash:
        let c1 = new Compiler({
            "/page1": require("../src/app/test_inclusion"),
            "/page1/subpage": require("../src/app/subpage"),
            "/page1/subpage/<name>": require("../src/app/subpage"),
            "/<any>": require("../src/app/digit"),
        });

        // but requested with trailing slashes:
        assert.throws(() => { c1.getLoadTarget("/") }, Error, "404 NotFound");
        assert.equal(require("../src/app/test_inclusion"), c1.getLoadTarget("/page1/").controller);
        assert.equal(require("../src/app/subpage"), c1.getLoadTarget("/page1/subpage/").controller);
        assert.equal(require("../src/app/subpage"), c1.getLoadTarget("/page1/subpage/andrey/").controller);
        assert.equal(require("../src/app/digit"), c1.getLoadTarget("/page2/").controller);

        // routes are defined with trailing slashes:
        let c2 = new Compiler({
            "/": require("../src/app/test_inclusion"),
            "/page1/": require("../src/app/test_inclusion"),
            "/page1/subpage/": require("../src/app/subpage"),
            "/page1/subpage/<name>/": require("../src/app/subpage"),
            "/<any>/": require("../src/app/digit"),
        });

        // but requested without:
        assert.equal(require("../src/app/test_inclusion"), c2.getLoadTarget("/").controller);
        assert.equal(require("../src/app/test_inclusion"), c2.getLoadTarget("/page1").controller);
        assert.equal(require("../src/app/subpage"), c2.getLoadTarget("/page1/subpage").controller);
        assert.equal(require("../src/app/subpage"), c2.getLoadTarget("/page1/subpage/andrey").controller);
        assert.equal(require("../src/app/digit"), c2.getLoadTarget("/page2").controller);
    });


    it('should select more specific pattern over those that are more general', () => {
        // helping order:
        let c1 = new Compiler({
            "/page1/subpage/<anything>/": require("../src/app/test_inclusion"),
            "/page1/<subpage>/<anything>/": require("../src/app/subpage"),
        });
        assert.equal(require("../src/app/test_inclusion"), c1.getLoadTarget("/page1/subpage/anything").controller);
        assert.equal(require("../src/app/subpage"), c1.getLoadTarget("/page1/anything/anything/").controller);

        // wrong order:
        let c2 = new Compiler({
            "/page1/<subpage>/<anything>/": require("../src/app/subpage"),
            "/page1/subpage/<anything>/": require("../src/app/test_inclusion"),
        });
        assert.equal(require("../src/app/test_inclusion"), c2.getLoadTarget("/page1/subpage/anything").controller);
        assert.equal(require("../src/app/subpage"), c2.getLoadTarget("/page1/anything/anything/").controller);
    });

    it('should be able to correctly extract url parameters', () => {
        let module1 = {
            template: "<a>{$request.action}</a>",
            init: function(internal){
                internal.api.returnRequest = () => { return internal.state.request; }
            }
        };
        let module2 = {
            template: "<a>{$request.action}|{$request.subpage}|{$request.anything}</a>",
            init: function(internal){
                internal.api.returnRequest = () => { return internal.state.request; }
            }
        }

        let c = new Compiler({
            "/<action>/": module1,
            "/page1/<subpage>/<anything>/": module2,
        });

        let target = c.getLoadTarget("/page1/");
        let widget1 = c.compileTarget(target);

        assert.equal("<a>page1</a>", widget1.render())
        assert.deepEqual({"action": "page1"}, widget1.api().returnRequest());

    });

});
