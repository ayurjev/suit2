

/**
 *  Component
 */
export class Component {

    constructor(uid, state, includes, app) {
        this.app = app;
        this.uid = uid;

        this.api = {};
        this.state = state || {};
        this.includes = includes || {};

        this.compileTemplate();
        this.init();
    }

    compileTemplate() {
        var template;
        try                     { if (window) { template = '<component id="' + this.uid + '">' + this.template() + '</component>'; }}
        catch (ReferenceError)  { template = this.template(); }

        template = template.replace(/\s\s+/mig, " ").trim();

        template = this.app.chunks(template, (to_compile) => {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return "`+this.exp(`"+s+"`)+`";
            });
        });
        this.template = () => { return eval('() => { return `' + template + '`}')().replace(/\s\s+/mig, " "); }
    }

    setState(state) { this.state = state; }

    component(t, additional_scope, iternum) {
        if (t instanceof Component) {
            t.setState(Object.assign({}, t.state, this.app.deepClone(this.state), additional_scope || {}))
            return t;
        }
        return this.app.component(t, Object.assign({}, this.app.deepClone(this.state), additional_scope || {}));
    }

    tag() { try { return document.getElementById(this.uid);  } catch (e) {} }
    subscribe(eName, cb, origin) { window.app.subscribe(eName, cb, origin); }
    broadcast(eName, message) { window.app.broadcast(eName, message, this.api); }
    createListeners() {}
    init() {}
    template() {}

    /**
     * Refreshing component in DOM
     */
    refresh() {
        try {
            var tag = this.tag();
            var target = tag;
            if (window.app.config.refresh_up && window.app.config.state == "shared") {
                do { target = tag; tag = tag.findParent("component"); } while (tag)
            }

            target.outerHTML = window.app.instances[target.getAttribute("id")].render();
        } catch (e) {}
    }

    /**
     * Getting Public Api of the Widget
     */
    getApi() {
        return Object.assign(
            {},
            {uid: () => { return this.uid; }, init: () => { this.init(); }, createListeners: () => { this.createListeners(); }},
            this.api
        );
    }

    /**
     *  Rendering Widget into string
     */
    render(state) {
        this.state = state || this.state;
        return this.template();
    }
}
