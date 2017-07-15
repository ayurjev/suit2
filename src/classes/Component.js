
import {Filters} from "./Filters";
import {ComponentNotFoundError} from "./Exceptions";


/**
 *  Component
 */
export class Component {

    constructor(uid, state, includes, componentName, app, template, init) {
        this.uid = uid;
        this.state = state || {};
        this.includes = includes || {};
        this.componentName = componentName;
        this.app = app;

        this.api = {};

        var template;
        try                     { if (window) { template = '<component id="' + this.uid + '">' + (template || this.template()) + '</component>'; }}
        catch (ReferenceError)  { template = (template || this.template()); }

        template = template.replace(/\s\s+/mig, " ").trim();

        template = this.app.chunks(template, (to_compile) => {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return "`+this.exp(`"+s+"`)+`";
            });
        });

        this.cb = () => { return eval('() => { return `' + template + '`}')(); }

        this.init = init ? () => { init(this); } : this.init;
        if (this.init) this.init();
    }

    setState(state) {
        this.state = state;
    }

    component(t, additional_scope, iternum) {
        if (t instanceof Component) {
            t.setState(Object.assign({}, t.state, this.app.deepClone(this.state), additional_scope || {}))
            return t;
        }
        return this.app.compile(t, Object.assign({}, this.app.deepClone(this.state), additional_scope || {}));
    }
    tag() { try { return document.getElementById(this.uid);  } catch (e) {} }
    subscribe(eName, cb, origin) { window.app.subscribe(eName, cb, origin); }
    broadcast(eName, message) { window.app.broadcast(eName, message, this.api); }
    createListeners() {}

    init() {}
    template() { return ""; }

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
        return this.cb().replace(/\s\s+/mig, " ");
    }

    /**
     *  Executing template engine expression - {}
     */
    exp(source, additional_scope, iternum) {

        try                 { source = source.trim(); }
        catch (TypeError)   { return ""; }

        if (/\((.+?)\)/mig.test(source)) {
            source = source.replace(/\((.+?)\)/mig, (m,s) => {
                return "(" + this.exp(s, additional_scope, iternum) + ")";
            });
        }

        if (/^for (.+?) in (.+?)\s(.+?)$/mig.test(source)) return this.list(source, additional_scope, iternum);
        if (/^include:(.+?)$/mig.test(source)) return this.include_with(source, additional_scope, iternum);
        if (/^rebuild:(.+?)$/mig.test(source)) return this.rebuild(source, additional_scope, iternum);
        if (/(.+?)\s\?\s(.+?)/mig.test(source)) return this.ternary(source, additional_scope, iternum);

        var seps = ["&&", "||", "==", "!=", " < ", " > ", ">=", "<="];
        for (var i=0; i < seps.length; i++) {
            if (source.indexOf(seps[i]) > -1) {
                let [l,r] = source.split(seps[i]);
                return this.cmp2(l, r, seps[i], additional_scope, iternum);
            }
        }

        if (source.indexOf("[") == 0 || source.indexOf("{") == 0) return source;
        return this.var(source, additional_scope, iternum);
    }

    /**
     * Executing call for a variable
     */
    var(source, additional_scope, iternum) {
        var that = this;
        var result = null;
        if (source.indexOf("$") > -1) {
            source = source.replace(
                /\$[A-Za-zА-Яа-я0-9_.]+(\|+(.+?)[\)\s])*/mig,
                function (m,s) { return that.extract(m, additional_scope, iternum); }
            );
        }

        try         { result = eval(source); }
        catch (e)   { result = source; }
        return result;
    }

    /**
     * Extracting variable's value
     */
    extract(path, additional_scope, iternum) {
        var value = null;
        var filter = null;
        var data = Object.assign({}, this.state, additional_scope);

        if (path.indexOf("$") == 0 && path.indexOf("|") > -1) [path, filter] = path.split("|");

        if (iternum && path == "$i") return iternum();

        path = path.replace("$", "").trim().split(".");
        var path_part = path.shift();

        while (path_part) {
            if (path_part in data) {
                value = data[path_part];
                data = data[path_part];
                path_part = path.shift();
            }
            else {
                value = null;
                path_part = null;
            }
        }

        //value = this.escape(value);

        if (filter) {
            let [,params] = filter.match(/(?:.+?)\((.*?)\)$/);
            if (
                params.length &&
                params.indexOf('"') != 0 && params.indexOf("'") != 0 &&
                params.indexOf('[') != 0 && params.indexOf('{') != 0
            ) {
                filter = filter.replace(params, '"' + params + '"');
            }
            var f = new Filters(value);
            value = eval("f." + filter);
        }
        return value;
    }

    /**
     *  Escaping special characters
     */
    escape(obj) {
        if (typeof(obj) == "string") {
            var entityMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;'};
            return obj.replace(/[&<>"'\/]/g, function (s) { return entityMap[s]; });
        }
        return obj;
    }

    /**
     * Evaluating basic js logic operations
     */
    cmp2(v1, v2, op, additional_scope, iternum) {
        v1 = this.exp(v1, additional_scope, iternum);
        v2 = this.exp(v2, additional_scope, iternum);
        try { return eval(v1 + op + v2); }
        catch (ReferenceError) {
            try { return eval(v1 + op + '`' + v2 + '`'); }
            catch (ReferenceError) {
                try { return eval('`' + v1 + '`' + op + v2); }
                catch (ReferenceError) { return eval('`' + v1 + '`' + op + '`' + v2 + '`'); }
            }
        }
    }

    /**
     *  Evaluating ternanry logic
     */
    ternary(var_name, additional_scope, iternum) {
        var_name = var_name.replace(":", "?");
        let [path, positive, negative] = var_name.split("?");
        return this.exp(path, additional_scope, iternum)
            ? this.exp(positive, additional_scope, iternum)
            : this.exp(negative, additional_scope, iternum);
    }

    /**
     * Evaluating iterations/lists
     */
    list(expression, additional_scope, iternum) {

        let [,iterkey,iterable,itertemplate] = expression.match(/for (.+?) in (.+?)\s(.+?)$/);

        itertemplate = itertemplate.replace(/\s\s+/mig, " ").trim();
        iterkey = iterkey.replace("$", "");

        if (iterable.indexOf("[") == 0 || iterable.indexOf("{") == 0) iterable = JSON.parse(iterable);
        else iterable = this.extract(iterable);

        var out = "";
        var that = this;

        if (itertemplate[0] != "{") itertemplate = "{" + itertemplate + "}";

        var itertemplate_compiled = this.app.chunks(itertemplate, function(to_compile) {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return `\` + ((component, scope, iternum) => { return component.exp(\``+s+`\`, scope, iternum); })(component, scope, iternum) + \``;
            });
        });

        itertemplate_compiled = eval(`((component, scope, iternum) => { return \`` + itertemplate_compiled + `\`; })`);

        var i = 0;
        iterable.forEach(function(itervalue, num) {
            var local_scope = additional_scope || {};
            local_scope[iterkey] = itervalue;
            out += itertemplate_compiled(that, local_scope, function() { i++; return i; });
        });

        return out;
    }

    /**
     * Including other components
     */
    include(expression, additional_scope, iternum) {
        expression = expression.replace("include:", "").trim();

        if (expression.indexOf("$") == 0) expression = this.extract(expression);

        var t = this.includes[expression] || this.app.global_includes[expression];


        if (!t) {
            throw new ComponentNotFoundError("Component '" + expression + "' not found");
        };

        var component = this.component(t, additional_scope, iternum);

        return component.render();
    }

    /**
     * Building scope from string and iteration data
     */
    scope(data, additional_scope, iternum) {
        if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
            data = JSON.parse(this.var(data, additional_scope, iternum));
        }
        else data = this.extract(data);
        return Object.assign({}, this.app.deepClone(this.state), data);
    }

    /**
     * Including components with additional data, passed as substate
     */
    include_with(expression, additional_scope, iternum) {
        if (expression.indexOf("with") > -1) {
            let [,template,data] = expression.match(/include:(.+?) with\s(.+?)$/);
            additional_scope = this.scope(data, additional_scope, iternum);
            expression = template;
        }
        return this.include(expression, additional_scope, iternum);
    }

    /**
     *  Generating new component using other component as a template
     */
    rebuild(expression, additional_scope, iternum) {
        let [,template,data] = expression.match(/rebuild:(.+?) with\s(.+?)$/);

        try {
            data = JSON.parse(data);
        } catch (e) {
            var parsedData = {};
            data.replace(/{(.+?):(.+?)}/ig, (match, key, content) => {
                parsedData[key] = content;
            });
            data = parsedData;
        }

        for (var item in data) {
            var scope = Object.assign({}, this.app.deepClone(this.state), additional_scope)
            data[item] = this.exp(data[item]);
        }
        data = JSON.stringify(data);

        return this.include(template, this.scope(data, additional_scope, iternum), iternum);
    }
}
