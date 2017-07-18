
import {AmbigiousDomRequest} from "./Exceptions";


/**
 *  Component
 */
export class Component {

    constructor(uid, state, includes, app) {
        if (uid) {
            this.app = app;
            this.uid = uid;

            this.api = {};
            this.state = state || {};
            this.includes = includes || {};
            this.childs = [];

            var template;
            try                     { if (window) { template = '<component id="' + this.uid + '">' + this.template() + '</component>'; }}
            catch (ReferenceError)  { template = this.template(); }
            this.template = this.compileTemplate(template);
            this.init();
        }
    }

    compileTemplate(template) {
        template = template.replace(/\s\s+/mig, " ").trim();

        template = this.app.chunks(template, (to_compile) => {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return "`+this.exp(`"+s+"`)+`";
            });
        });
        return () => { return eval('() => { return `' + template + '`}')().replace(/\s\s+/mig, " "); }
    }

    setState(state) { this.state = state; }

    createComponent(t, additional_scope, iternum) {
        // if (t instanceof Component) {
        //     t.setState(Object.assign({}, t.state, this.app.deepClone(this.state), additional_scope || {}))
        //     return t;
        // }
        var component = this.app.createComponent(t, Object.assign({}, this.app.deepClone(this.state), additional_scope || {}), {}, this);
        this.childs.push(component);
        return component;
    }


    subscribe(eName, cb, origin) { window.app.subscribe(eName, cb, origin); }
    broadcast(eName, message) { window.app.broadcast(eName, message, this.api); }
    createListeners() {}
    init() {}
    template() {}

    tag() {
        return document.getElementById(this.uid);
    }

    ui(selector) {
        return found.length == 1 ? found[0] : found;
    }

    elem(selector) {
        var found = this.tag().querySelectorAll(selector);
        if (found.length > 1)
            throw new AmbigiousDomRequest("More than one element found with request elem('"+selector+"')");
        return found.length > 0 ? found[0] : null;
    }

    elems(selector) {
        return this.tag().querySelectorAll(selector);
    }

    components(type) {
        if (!type) return this.childs;
        type = type.default || type;
        var filtered = [];
        this.childs.forEach((c) => {
            if (c.constructor.name == (new (type)).constructor.name) filtered.push(c);
        });
        return filtered;
    }

    component(type) {
        var components = this.components(type);
        if (components.length > 1) throw new AmbigiousDomRequest("More than one component found with request component('"+type+"')");
        if (components.length == 0) return null;
        return components[0];
    }

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
        this.childs = []; // because we will repopulate this prop during render() execution
        this.state = state || this.state;
        return this.template();
    }
}
