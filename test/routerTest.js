var assert = require('assert');

import {Application,Widget} from "../src/classes/Application";


describe('Router', () => {

    let page = {"template": "page"};
    let subpage = {"template": "subpage"};
    let digit = {"template": "digit"};

    it('should select correct controller for clean urls and url with parameters', () => {
        let c = new Application({
            "/page/": page,
            "/page/subpage/": subpage,
            "/page/subpage/<name>/": subpage,
            "/<any>/": digit,
        });

        assert.throws(() => { c.getLoadTarget("/") }, Error, "404 NotFound");
        assert.equal(page, c.getLoadTarget("/page/").controller);
        assert.equal(subpage, c.getLoadTarget("/page/subpage/").controller);
        assert.equal(subpage, c.getLoadTarget("/page/subpage/andrey/").controller);
        assert.equal(digit, c.getLoadTarget("/page2/").controller);
    });

    it('should select correct controller despite usage of trailing slashes', () => {
        // routes are defined without trailing slash:
        let c1 = new Application({
            "/page": page,
            "/page/subpage": subpage,
            "/page/subpage/<name>": subpage,
            "/<any>": digit,
        });

        // but requested with trailing slashes:
        assert.throws(() => { c1.getLoadTarget("/") }, Error, "404 NotFound");
        assert.equal(page, c1.getLoadTarget("/page/").controller);
        assert.equal(subpage, c1.getLoadTarget("/page/subpage/").controller);
        assert.equal(subpage, c1.getLoadTarget("/page/subpage/andrey/").controller);
        assert.equal(digit, c1.getLoadTarget("/page2/").controller);

        // routes are defined with trailing slashes:
        let c2 = new Application({
            "/": page,
            "/page/": page,
            "/page/subpage/": subpage,
            "/page/subpage/<name>/": subpage,
            "/<any>/": digit,
        });

        // but requested without:
        assert.equal(page, c2.getLoadTarget("/").controller);
        assert.equal(page, c2.getLoadTarget("/page").controller);
        assert.equal(subpage, c2.getLoadTarget("/page/subpage").controller);
        assert.equal(subpage, c2.getLoadTarget("/page/subpage/andrey").controller);
        assert.equal(digit, c2.getLoadTarget("/page2").controller);
    });


    it('should select more specific pattern over those that are more general', () => {
        // helping order:
        let c1 = new Application({
            "/page/subpage/<anything>/": page,
            "/page/<subpage>/<anything>/": subpage,
        });
        assert.equal(page, c1.getLoadTarget("/page/subpage/anything").controller);
        assert.equal(subpage, c1.getLoadTarget("/page/anything/anything/").controller);

        // wrong order:
        let c2 = new Application({
            "/page/<subpage>/<anything>/": subpage,
            "/page/subpage/<anything>/": page,
        });
        assert.equal(page, c2.getLoadTarget("/page/subpage/anything").controller);
        assert.equal(subpage, c2.getLoadTarget("/page/anything/anything/").controller);
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

        let c = new Application({
            "/<action>/": module1,
            "/page/<subpage>/<anything>/": module2,
        });

        let target = c.getLoadTarget("/page/");
        let widget1 = c.compileTarget(target);

        assert.equal("<a>page</a>", widget1.render())
        assert.deepEqual({"action": "page"}, widget1.api().returnRequest());

    });

});
