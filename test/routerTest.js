var assert = require('assert');

import {Application} from "../src/classes/Application";
import {Component} from "../src/classes/Component";


describe('Router', () => {

    class PageComponent extends Component {
        template() { return `page`; }
    }

    class SubPageComponent extends Component {
        template() { return `subpage`; }
    }

    class DigitComponent extends Component {
        template() { return `digit`; }
    }


    it('should select correct controller for clean urls and url with parameters', () => {
        let app = new Application({
            "/page/": PageComponent,
            "/page/subpage/": SubPageComponent,
            "/page/subpage/<name>/": SubPageComponent,
            "/<any>/": DigitComponent,
        });

        assert.throws(() => { app.getLoadTarget("/") }, Error, "404 NotFound");
        assert(app.getLoadTarget("/page/") instanceof PageComponent);
        assert(app.getLoadTarget("/page/subpage/") instanceof SubPageComponent);
        assert(app.getLoadTarget("/page/subpage/andrey/") instanceof SubPageComponent);
        assert(app.getLoadTarget("/page2/") instanceof DigitComponent);
    });


    it('should select correct controller despite usage of trailing slashes', () => {
        // routes are defined without trailing slash:
        let app = new Application({
            "/page": PageComponent,
            "/page/subpage": SubPageComponent,
            "/page/subpage/<name>": SubPageComponent,
            "/<any>": DigitComponent,
        });

        // but requested with trailing slashes:
        assert.throws(() => { app.getLoadTarget("/") }, Error, "404 NotFound");
        assert(app.getLoadTarget("/page/") instanceof PageComponent);
        assert(app.getLoadTarget("/page/subpage/") instanceof SubPageComponent);
        assert(app.getLoadTarget("/page/subpage/andrey/") instanceof SubPageComponent);
        assert(app.getLoadTarget("/page2/") instanceof DigitComponent);

        // routes are defined with trailing slashes:
        let app2 = new Application({
            "/": PageComponent,
            "/page/": PageComponent,
            "/page/subpage/": SubPageComponent,
            "/page/subpage/<name>/": SubPageComponent,
            "/<any>/": DigitComponent,
        });

        // but requested without:
        assert(app2.getLoadTarget("/") instanceof PageComponent);
        assert(app2.getLoadTarget("/page") instanceof PageComponent);
        assert(app2.getLoadTarget("/page/subpage") instanceof SubPageComponent);
        assert(app2.getLoadTarget("/page/subpage/andrey") instanceof SubPageComponent);
        assert(app2.getLoadTarget("/page2") instanceof DigitComponent);
    });


    it('should select more specific pattern over those that are more general', () => {
        // helping order:
        let app1 = new Application({
            "/page/subpage/<anything>/": PageComponent,
            "/page/<subpage>/<anything>/": SubPageComponent,
        });
        assert(app1.getLoadTarget("/page/subpage/anything") instanceof PageComponent);
        assert(app1.getLoadTarget("/page/anything/anything/") instanceof SubPageComponent);

        // wrong order:
        let app2 = new Application({
            "/page/<subpage>/<anything>/": SubPageComponent,
            "/page/subpage/<anything>/": PageComponent,
        });
        assert(app2.getLoadTarget("/page/subpage/anything") instanceof PageComponent);
        assert(app2.getLoadTarget("/page/anything/anything/") instanceof SubPageComponent);
    });


    it('should be able to correctly extract url parameters', () => {

        class Module1 extends Component {
            template() { return "<a>{$request.action}</a>"; }
            init() {
                this.api.returnRequest = () => { return this.state.request; }
            }
        }

        class Module2 extends Component {
            template() { return "<a>{$request.action}|{$request.subpage}|{$request.anything}</a>"; }
            init() {
                this.api.returnRequest = () => { return this.state.request; }
            }
        }

        let app = new Application({
            "/<action>/": Module1,
            "/page/<subpage>/<anything>/": Module2,
        });

        let component = app.getLoadTarget("/page/");

        assert.equal("<a>page</a>", component.render())
        assert.deepEqual({"action": "page"}, component.getApi().returnRequest());

    });

});
