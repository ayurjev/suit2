try {

    String.prototype.replaceAll = function(search, replacement) {
        return this.replace(new RegExp(search, 'g'), replacement);
    };

    String.prototype.trimAll = function(mask) {
        var s = this;
        while (~mask.indexOf(s[0])) { s = s.slice(1); }
        while (~mask.indexOf(s[s.length - 1])) { s = s.slice(0, -1); }
        return s;
    };

    Element.prototype.find_parent = function(css) {
        var parent = this.parentElement;
        while (parent) {
            if (parent.matches(css)) return parent;
            else parent = parent.parentElement;
        }
        return null;
    };

} catch (e) {}


class Filter {
    constructor(value) { this.value = value; }

    length() {
        if (!this.value) return 0;
        if (this.value instanceof Object) {
            var counter = 0;
            for (var k in this.value) counter++;
            return counter;
        }
        if (this.value === true) return 1;
        return this.value.length;
    }

    format(format_str) {
        var date_obj = this.value instanceof Date ? this.value : new Date(this.value);
        if (Object.prototype.toString.call(date_obj) != "[object Date]" || isNaN(date_obj.getTime())) { return date; }
        var pad = (val) => { return String(val).length == 1 ? "0" + val : val; };
        format_str = format_str.replace("%d", pad(date_obj.getDate()));
        format_str = format_str.replace("%m", pad(date_obj.getMonth() + 1));
        format_str = format_str.replace("%y", String(date_obj.getFullYear())[2] + String(date_obj.getFullYear())[3]);
        format_str = format_str.replace("%Y", date_obj.getFullYear());
        format_str = format_str.replace("%H", pad(date_obj.getHours()));
        format_str = format_str.replace("%M", pad(date_obj.getMinutes()));
        format_str = format_str.replace("%S", pad(date_obj.getSeconds()));
        return format_str;
    }

    in(haystack) {
        var needle = this.value;
        if (needle == null || haystack == null) { return false; }
        if (typeof(haystack) == "string")
        {
            try                                 { haystack = JSON.parse(haystack); }
            catch (e)                           { return !!(haystack.indexOf(needle) > -1); }
        }
        if (haystack instanceof Array)          { return haystack.indexOf(needle) > -1; }
        if (haystack instanceof Object)         { return needle in haystack; }
    };

    pluralword(words) {
        if (typeof(words) == "string") words = JSON.parse(words);
        var num = parseInt(this.value) % 100;
        if (num > 19) { num = num % 10; }
        return {1: words[0], 2: words[1], 3: words[1], 4: words[1]}[num] || words[2];
    };

    html() {
        return decodeURI(this.value
            .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x2F;/g, "/")
        );
    }

    json()              { return JSON.stringify(this.value); }
    exists()            { return this.length() > 0; }
    pluralform(words)   { return this.value + " " + this.pluralword(words); };
    startswith(prefix)  { return this.value.indexOf(prefix) == 0; }
    endswith(suffix)    { return this.value.indexOf(suffix) == this.value.length - suffix.length; }
    contains(needle)    { return new Filter(needle).in(this.value); };
}


export class Widget {

    constructor(cb, internal, compiler) {
        this.compiler = compiler;
        this.cb = cb;
        this.internal = internal;

        this.internal.refresh = () => {
            try
            {
                var widget = document.getElementById(this.internal.uid);
                var target = widget;
                if (this.compiler.config.refresh_up && this.compiler.config.state == "shared") {
                    do {
                        target = widget;
                        widget = widget.find_parent("widget");
                    } while (widget)
                }

                target.outerHTML = this.compiler.instances[target.getAttribute("id")].render();
            }
            catch (e) {}
        }

        this.internal.subscribe = (eName, cb, origin) => { this.compiler.subscribe(eName, cb, origin); }
        this.internal.broadcast = (eName, message) => { this.compiler.broadcast(eName, message, this.internal.api); }
    }

    api() { return this.internal.api; }

    render(state) {
        this.internal.state = state || this.internal.state;
        return this.cb().replace(/\s\s+/mig, " ");
    }

    exp(source, additional_scope, iternum) {

        try                 { source = source.trim(); }
        catch (TypeError)   { return ""; }

        if (/\((.+?)\)/mig.test(source)) {
            source = source.replace(/\((.+?)\)/mig, (m,s) => {
                return "(" + this.exp(s, additional_scope, iternum) + ")";
            });
        }

        if (/for (.+?) in (.+?)\s(.+?)/mig.test(source)) return this.list(source, additional_scope, iternum);
        if (/include:(.+?)/mig.test(source)) return this.include_with(source, additional_scope, iternum);
        if (/rebuild:(.+?)/mig.test(source)) return this.rebuild(source, additional_scope, iternum);
        if (/(.+?)\?(.+?)/mig.test(source)) return this.ternary(source, additional_scope, iternum);

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

    extract(path, additional_scope, iternum) {
        var value = null;
        var filter = null;
        var data = Object.assign({}, this.internal.state, additional_scope);

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

        value = this.escape(value);

        if (filter) {
            let [,params] = filter.match(/(?:.+?)\((.*?)\)$/);
            if (
                params.length &&
                params.indexOf('"') != 0 && params.indexOf("'") != 0 &&
                params.indexOf('[') != 0 && params.indexOf('{') != 0
            ) {
                filter = filter.replace(params, '"' + params + '"');
            }

            value = eval("(new Filter(value))." + filter);
        }

        return value;
    }

    escape(obj) {
        if (typeof(obj) == "string") {
            var entityMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;'};
            return obj.replace(/[&<>"'\/]/g, function (s) { return entityMap[s]; });
        }
        return obj;
    }

    cmp2(v1, v2, sep,additional_scope, iternum) {
        v1 = this.exp(v1, additional_scope, iternum);
        v2 = this.exp(v2, additional_scope, iternum);
        try { return eval(v1 + sep + v2); }
        catch (ReferenceError) {
            try { return eval(v1 + sep + '`' + v2 + '`'); }
            catch (ReferenceError) {
                try { return eval('`' + v1 + '`' + sep + v2); }
                catch (ReferenceError) { return eval('`' + v1 + '`' + sep + '`' + v2 + '`'); }
            }
        }
    }

    ternary(var_name, additional_scope, iternum) {
        var_name = var_name.replace(":", "?");
        let [path, positive, negative] = var_name.split("?");
        return this.exp(path, additional_scope, iternum)
            ? this.exp(positive, additional_scope, iternum)
            : this.exp(negative, additional_scope, iternum);
    }

    list(expression, additional_scope, iternum) {

        let [,iterkey,iterable,itertemplate] = expression.match(/for (.+?) in (.+?)\s(.+?)$/);

        itertemplate = itertemplate.replace(/\s\s+/mig, " ").trim();
        iterkey = iterkey.replace("$", "");

        if (iterable.indexOf("[") == 0 || iterable.indexOf("{") == 0) iterable = JSON.parse(iterable);
        else iterable = this.extract(iterable);

        var out = "";
        var that = this;

        if (itertemplate[0] != "{") itertemplate = "{" + itertemplate + "}";

        var itertemplate_compiled = this.compiler.chunks(itertemplate, function(to_compile) {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return `\` + ((widget, scope, iternum) => { return widget.exp(\``+s+`\`, scope, iternum); })(widget, scope, iternum) + \``;
            });
        });

        itertemplate_compiled = eval(`((widget, scope, iternum) => { return \`` + itertemplate_compiled + `\`; })`);

        var i = 0;
        iterable.forEach(function(itervalue, num) {
            var local_scope = additional_scope || {};
            local_scope[iterkey] = itervalue;
            out += itertemplate_compiled(that, local_scope, function() { i++; return i; });
        });

        return out;
    }

    include(expression, additional_scope, iternum) {

        expression = expression.replace("include:", "").trim();

        if (expression.indexOf("$") == 0) expression = this.extract(expression);

        var t = this.internal.includes[expression];

        if (t.uid instanceof Function || t instanceof Array) {
            t = this.internal._includes[expression];
        }

        if (!t) { require(expression); }

        var widget = this.compiler.compile(
            t, Object.assign({},  this.compiler.deepclone(this.internal.state), additional_scope)
        );

        if (t.uid instanceof Function) {
            this.internal.includes[expression] = [t, widget.api()];
        }
        else if (t instanceof Array) {
            this.internal.includes[expression].push(widget.api());
        } else {
            if (!this.internal._includes) this.internal._includes = {};
            this.internal._includes[expression] = t;
            this.internal.includes[expression] = widget.api();
        }

        return widget.render();
    }

    scope(data, additional_scope, iternum) {
        if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
            data = this.var(data, additional_scope, iternum);
            data = JSON.parse(data);
        }
        else data = this.extract(data);

        return Object.assign({}, this.compiler.deepclone(this.internal.state), data);
    }

    include_with(expression, additional_scope, iternum) {
        if (expression.indexOf("with") > -1) {
            let [,template,data] = expression.match(/include:(.+?) with\s(.+?)$/);
            additional_scope = this.scope(data, additional_scope, iternum);
            expression = template;
        }
        return this.include(expression, additional_scope, iternum);
    }

    rebuild(expression, additional_scope, iternum) {
        let [,template,data] = expression.match(/rebuild:(.+?) with\s(.+?)$/);
        return this.include(template, this.scope(data, additional_scope, iternum), iternum);
    }
}


class ControllerFactory {
    constructor(router) {
        this.router = {};
        for (var routePattern in router) { this.router[routePattern.trimAll("/")] = router[routePattern]; };
    }

    extractParameters(url, routePattern) {
        var result = {};
        let names = routePattern.trimAll("/").split("/");
        let values = url.trimAll("/").split("/");

        for (var i=0; i<names.length; i++) {
            var name = names[i];
            if ((new RegExp("<.+?>")).test(name)) {
                var trimmedName = name.replaceAll("<", "").replaceAll(">", "");
                result[trimmedName] = values[i];
            }
        }
        return result;
    }

    get(url) {
        url = url.trimAll("/");

        let fast_acs_controller = this.router[url];
        if (fast_acs_controller != null) return {"controller": fast_acs_controller, "request": {}};

        var best_controller = null;
        var best_controller_request = {};
        var best_controller_placeholders = 1000;
        for (var routePattern in this.router) {
            if (this.isMatch(url, routePattern)) {
                var phCount = routePattern.match(/<(.+?)>/g).length;
                if (phCount < best_controller_placeholders) {
                    best_controller = this.router[routePattern];
                    best_controller_request = this.extractParameters(url, routePattern);
                    best_controller_placeholders = phCount;
                    if (phCount == 1) break;
                }
            }
        };
        if (best_controller) return {"controller": best_controller, "request": best_controller_request};
        throw new Error("404 NotFound")
    }

    isMatch(url, routePattern) {
        routePattern = "^" + routePattern + "$";
        return (new RegExp(routePattern.trimAll("/").replaceAll("(<(.+?)>)", "(.+?)"))).test(url.trimAll("/"));
    }
}


export class Compiler {
    constructor(router, config) {
        this.router = router || {};
        this.config = config || {};
        this.instances = {};
        this.subscriptions = {};
        this.uids_cache = {};
        this.router.strategy = this.router.strategy || new HashStrategy();

        this.controllerFactory = new ControllerFactory(this.router);

        this.initDomListeners();
    }

    initDomListeners() {
        try {
            document.body.addEventListener("click", (event) => {
                if (event.target.tagName.toLowerCase() == "a") {
                    this.router.strategy.onClick(event);
                    event.preventDefault();
                }
            });

            window.addEventListener('popstate', (e) => { this.load() }, false);

        } catch (ReferenceError) {}
    }

    deepclone(source) {
        if (this.config.state == "shared") return source;
        var destination = {};
        for (var property in source) {
            if (typeof source[property] === "object" && source[property] !== null) {
                destination[property] = this.deepclone(source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    };

    chunks(template, compile_cb) {
            var repl = {};

            var start = template.indexOf("{");

            while (start > -1) {
                var stack = 1;
                var p = start;

                while (stack > 0) {
                    p++;
                    if (template[p] == "{") stack++;
                    if (template[p] == "}") stack--;
                }

                var to_compile = template.slice(start, p + 1);
                var compiled = compile_cb(to_compile);

                var next_start = template.slice(p + 1, template.length).indexOf("{")
                if (next_start > -1) start = p + next_start + 1;
                else start = -1;

                repl[to_compile] = compiled;
            }

            for (to_compile in repl) { template = template.replace(to_compile, repl[to_compile]); }

            return template;
    }

    generateUID() {
        var p = () => { return ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3) };
        return p() + p();
    }

    generateUID2(t) {
        // TODO: it is not good idea to use the whole temlate as a key...
        // We should use a hash, but there is no md5 function in raw js
        if (this.uids_cache[t.template]) return this.uids_cache[t.template];
        else {
            var uid = this.generateUID();
            this.uids_cache[t.template] = uid;
            return uid;
        }
    }

    compile(t, state, includes) {

        var uid = this.generateUID2(t);
        var prev_state = this.instances[uid] ? this.instances[uid].internal.state : {};
        var internal = new Internal(uid, Object.assign(prev_state, state), includes);

        if (t.init) t.init(internal);

        var template;
        try                     { if (window) { template = '<widget id="' + uid + '">'+t.template+'</widget>'; }}
        catch (ReferenceError)  { template = t.template; }

        template = template.replace(/\s\s+/mig, " ").trim();
        template = this.chunks(template, (to_compile) => {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return "`+this.exp(`"+s+"`)+`";
            });
        });

        this.instances[uid] = new Widget(() => { return eval('() => { return `' + template + '`}')(); }, internal, this);

        return this.instances[uid];
    }

    compileTarget(target) {
        return this.compile(target.controller, Object.assign({}, this.config, {"request": target.request}));
    }

    load(url) {
        this.clear();

        let loadTarget = this.getLoadTarget();

        if (loadTarget) {
            document.body.innerHTML = this.compileTarget(loadTarget).render();

            var widgets = [].slice.call(document.getElementsByTagName("widget"));
            widgets.forEach((widget) => {
                var api = this.instances[widget.getAttribute("id")].api();
                api.createListeners();
            });
        }
    }

    getLoadTarget(url) {
        return this.controllerFactory.get(url || this.router.strategy.getCurrentLocation())
    }

    clear() {
        this.instances = {};
        this.subscriptions = {};
    }

    subscribe(eventName, cb, origin) {
        if (!this.subscriptions[eventName]) this.subscriptions[eventName] = [];
        this.subscriptions[eventName].push([cb, origin]);
    };

    broadcast(eventName, message, origin) {
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName].forEach((data) => {
                let cb = data[0];
                let required_origin = data[1];
                if (!required_origin) cb(message, origin);
                else {
                    (required_origin instanceof Array ? required_origin : [required_origin]).forEach((obj) => {
                        if (obj.uid && obj.uid() == origin.uid()) cb(message, obj);
                    });
                }
            });
        }
    };

}

class Internal {
    constructor(uid, state, includes) {
        this.uid = uid;
        this.api = {
            createListeners: () => {},
            uid: () => { return this.uid; }
        };
        this.state = state || {};
        this.includes = includes || {};
    }
}


export class HashStrategy {
    getCurrentLocation() {
        return (location.hash || "/").replace("#", "");
    }
    onClick(event) {
        var href = event.target.href;
        if (location.protocol == "file:" && href.indexOf("file://") == 0) href = href.replace("file://", "");
        location.hash = href;
    }
}

try {

    var domReady = function(callback) {
        document.readyState === "interactive" || document.readyState === "complete"
        ? callback()
        : document.addEventListener("DOMContentLoaded", callback);
    };

    domReady(() => {
        window.compiler = new Compiler(window.router, window.config);
        window.compiler.load();
     });

} catch (e) {}
