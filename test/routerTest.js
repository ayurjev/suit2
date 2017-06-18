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
        assert.equal(require("../src/app/test_inclusion"), c.getLoadTarget("/page1/"));
        assert.equal(require("../src/app/subpage"), c.getLoadTarget("/page1/subpage/"));
        assert.equal(require("../src/app/subpage"), c.getLoadTarget("/page1/subpage/andrey/"));
        assert.equal(require("../src/app/digit"), c.getLoadTarget("/page2/"));
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
        assert.equal(require("../src/app/test_inclusion"), c1.getLoadTarget("/page1/"));
        assert.equal(require("../src/app/subpage"), c1.getLoadTarget("/page1/subpage/"));
        assert.equal(require("../src/app/subpage"), c1.getLoadTarget("/page1/subpage/andrey/"));
        assert.equal(require("../src/app/digit"), c1.getLoadTarget("/page2/"));

        // routes are defined with trailing slashes:
        let c2 = new Compiler({
            "/": require("../src/app/test_inclusion"),
            "/page1/": require("../src/app/test_inclusion"),
            "/page1/subpage/": require("../src/app/subpage"),
            "/page1/subpage/<name>/": require("../src/app/subpage"),
            "/<any>/": require("../src/app/digit"),
        });

        // but requested without:
        assert.equal(require("../src/app/test_inclusion"), c2.getLoadTarget("/"));
        assert.equal(require("../src/app/test_inclusion"), c2.getLoadTarget("/page1"));
        assert.equal(require("../src/app/subpage"), c2.getLoadTarget("/page1/subpage"));
        assert.equal(require("../src/app/subpage"), c2.getLoadTarget("/page1/subpage/andrey"));
        assert.equal(require("../src/app/digit"), c2.getLoadTarget("/page2"));
    });


    it('should select more specific pattern over those that are more general', () => {
        // helping order:
        let c1 = new Compiler({
            "/page1/subpage/<anything>/": require("../src/app/test_inclusion"),
            "/page1/<subpage>/<anything>/": require("../src/app/subpage"),
        });
        assert.equal(require("../src/app/test_inclusion"), c1.getLoadTarget("/page1/subpage/anything"));
        assert.equal(require("../src/app/subpage"), c1.getLoadTarget("/page1/anything/anything/"));

        // wrong order:
        let c2 = new Compiler({
            "/page1/<subpage>/<anything>/": require("../src/app/subpage"),
            "/page1/subpage/<anything>/": require("../src/app/test_inclusion"),
        });
        assert.equal(require("../src/app/test_inclusion"), c2.getLoadTarget("/page1/subpage/anything"));
        assert.equal(require("../src/app/subpage"), c2.getLoadTarget("/page1/anything/anything/"));
    });

});
