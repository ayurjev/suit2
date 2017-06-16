
export class Widget {

    constructor(cb, internal, compiler) {
        this.compiler = compiler;
        this.cb = cb;
        this.internal = internal;

        this.internal.refresh = (forcedState) => {
            document.getElementById(this.internal.uid).outerHTML = this.render(forcedState);
        }

        this.internal.subscribe = (eventName, cb, origin) => {
            window.subscribe(eventName, cb, origin);
        }

        this.internal.broadcast = (eventName, message) => {
            window.broadcast(eventName, message, this.internal.api);
        }
    }

    api() {
        return this.internal.api;
    }

    render(state) {
        this.internal.state = state || this.internal.state;
        var result = this.cb();
        result = result.replace(/\s\s+/mig, " ");
        return result;
    }

    exp(source, additional_scope, iternum) {

        if (source === undefined) return "";

        source = source.trim();

        if (/\((.+?)\)/mig.test(source)) {
            source = source.replace(/\((.+?)\)/mig, (m,s) => {
                return "("+this.exp(s, additional_scope, iternum)+")";
            })
        }

        if (/for (.+?) in (.+?)\s(.+?)/mig.test(source)) return this.list(source, additional_scope, iternum);
        if (/include:(.+?) with\s(.+?)/mig.test(source)) return this.include_with(source, additional_scope, iternum);
        if (/include:(.+?)/mig.test(source)) return this.include(source, additional_scope, iternum);

        if (/rebuild:(.+?) with\s(.+?)/mig.test(source)) return this.rebuild(source, additional_scope, iternum);

        if (/(.+?)\?(.+?)\: (.+?)/mig.test(source)) return this.ternary(source, additional_scope, iternum);
        if (/(.+?)\?(.+?)/mig.test(source)) return this.ternary(source, additional_scope, iternum);

        if (/(.+?)&&(.+?)/mig.test(source)) return this.cmp(source, "&&", additional_scope, iternum);
        if (/(.+?)\|\|(.+?)/mig.test(source)) return this.cmp(source, "||", additional_scope, iternum);
        if (/(.+?)==(.+?)/mig.test(source)) return this.cmp(source, "==", additional_scope, iternum);
        if (/(.+?)==(.+?)/mig.test(source)) return this.cmp(source, "!=", additional_scope, iternum);
        if (/(.+?) < (.+?)/mig.test(source)) return this.cmp(source, "<", additional_scope, iternum);
        if (/(.+?) > (.+?)/mig.test(source)) return this.cmp(source, ">", additional_scope, iternum);
        if (/(.+?)<=(.+?)/mig.test(source)) return this.cmp(source, "<=", additional_scope, iternum);
        if (/(.+?)>=(.+?)/mig.test(source)) return this.cmp(source, ">=", additional_scope, iternum);

        return this.var(source, additional_scope, iternum);
    }

    var(source, additional_scope, iternum) {
        var that = this;

        if (source.indexOf("$") > -1) {

            var default_value = null;
            if (source.indexOf("$") == 0 && source.indexOf(":") > -1) [source, default_value] = source.split(":");

            if (default_value) {
                source = that.extract(source, additional_scope, iternum) || default_value;
            } else {
                source = source.replace(
                    /\$([A-Za-z0-9_.]+)/mig,
                    function (m,s) { return that.extract(m, additional_scope, iternum); }
                );
            }
        }

        try {
            return eval(source);
        } catch (Exception){
            return source;
        }
    }

    extract(path, additional_scope, iternum) {

        if (iternum && path == "$i") return iternum();

        path = path.replace("$$", "").replace("$", "").trim().split(".");
        var data = this.internal.state;
        var value = null;
        var path_part = path.shift();

        while (path_part) {
            if (additional_scope && path_part in additional_scope) {
                value = additional_scope[path_part];
                additional_scope = additional_scope[path_part];
                path_part = path.shift();
            }
            else if (path_part in data) {
                value = data[path_part];
                data = data[path_part];
                path_part = path.shift();
            }
            else {
                path_part = null;
                value = null;
            }
        }
        return value;
    }

    cmp(var_name, sep, additional_scope, iternum) {
        let [v1, v2] = var_name.split(sep);
        if (sep == "||") {
            try {
                return eval(this.exp(v1, additional_scope, iternum) + sep + this.exp(v2, additional_scope, iternum));
            } catch (ReferenceError) {
                return eval(this.exp(v1, additional_scope, iternum) + sep + '`' + this.exp(v2, additional_scope, iternum) + '`');
            }
        }
        return eval(this.exp(v1, additional_scope, iternum) + sep + this.exp(v2, additional_scope, iternum));
    }

    ternary(var_name, additional_scope, iternum) {
        var_name = var_name.replace(":", "?");
        let [path, positive, negative] = var_name.split("?");
        return this.exp(path, additional_scope, iternum) ? this.exp(positive, additional_scope, iternum) : this.exp(negative, additional_scope, iternum);
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

        itertemplate_compiled = `((widget, scope, iternum) => { return \`` + itertemplate_compiled + `\`; })`;
        itertemplate_compiled = eval(itertemplate_compiled);

        var i = 0;
        iterable.forEach(function(itervalue, num) {
            var local_scope = Object.assign(additional_scope || {});
            local_scope[iterkey] = itervalue;
            out += itertemplate_compiled(that, local_scope, function() { i++; return i; });
        });

        return out;
    }

    include(expression, additional_scope, iternum) {

        expression = expression.replace("include:", "").trim();

        var t = this.internal.includes[expression];

        if (t instanceof Array) {
            t = t[0];
        }

        if (!t) {
            require(expression);
        }

        var widget = this.compiler.compile(t, Object.assign({}, this.internal.state, additional_scope));

        if (t instanceof Array) {
            this.internal.includes[expression].push(widget.api());
        } else {
            this.internal.includes[expression] = [t, widget.api()];
        }

        return widget.render();
    }

    include_with(expression, additional_scope, iternum) {
        let [,template,data] = expression.match(/include:(.+?) with\s(.+?)$/);

        if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
            data = this.var(data, additional_scope, iternum);
            data = JSON.parse(data);
        }
        else data = this.extract(data);

        return this.include(template, Object.assign({}, this.internal.state, data), iternum);
    }

    rebuild(expression, additional_scope, iternum) {
        let [,template,data] = expression.match(/rebuild:(.+?) with\s(.+?)$/);

        if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
            data = this.var(data, additional_scope, iternum);
            data = JSON.parse(data);
        }
        else data = this.extract(data);

        return this.include(template, Object.assign({}, this.internal.state, data), iternum);
    }
}


export class Compiler {
    constructor() {}

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

            for (to_compile in repl) {
                template = template.replace(to_compile, repl[to_compile]);
            }

            return template;
    }

    generateUID() {
        var p = () => { return ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3) };
        return p() + p();
    }

    build_internal(uid, state, includes, t) {
        return {
            uid: uid,
            api: {createListeners: ()=>{}, uid: () => { return uid; }},
            state: state,
            includes: includes
        };
    }

    compile(t, state, includes) {
        var uid = this.generateUID();

        state = state || {};
        includes = includes || {};
        var internal = this.build_internal(uid, state, includes, t);

        if (t.init) t.init(internal);

        var template;

        try {
            window.instances[uid] = internal.api;
            template = '<widget id="' + uid + '">'+t.template+'</widget>';
        }
        // no window object:
        catch (Exception) {
            template = t.template;
        }

        template = template.replace(/\s\s+/mig, " ").trim();
        template = this.chunks(template, (to_compile) => {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return "`+this.exp(`"+s+"`)+`";
            });
        });

        return new Widget(() => { return eval('() => { return `' + template + '`}')(); }, internal, this);
    }

}

export class HashStrategy {
    getCurrentLocation() {
        var url = location.hash || "/";
        url = url.replace("#", "");
        return url;
    }
    onClick(event) {
        var href = event.target.href;
        if (location.protocol == "file:" && href.indexOf("file://") == 0) href = href.replace("file://", "");
        location.hash = href;
    }
}

try {
    var domReady = function(callback) {
        document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
    };

    domReady(() => {

        // init/clear instances storage:
        window.instances = {};

        // init/clear subscriptions:
        window.subscriptions = {};

        window.subscribe = (eventName, cb, origin) => {
            if (!window.subscriptions[eventName]) window.subscriptions[eventName] = [];
            window.subscriptions[eventName].push([cb, origin]);
        };

        window.broadcast = (eventName, message, origin) => {
            if (window.subscriptions[eventName]) {
                window.subscriptions[eventName].forEach((data) => {
                    let cb = data[0];
                    let required_origin = data[1];

                    if (!required_origin) cb(message, origin);
                    else {
                        required_origin.forEach((obj) => {
                            if (obj.uid && obj.uid() == origin.uid()) cb(message, obj);
                        });
                    }
                });
            }
        };

        // get routing strategy:
        var strategy = window.router.strategy || new HashStrategy();

        var load = function(url) {

            // get loadTarget:
            url = url || strategy.getCurrentLocation();
            var loadTarget = window.router[url];

            if (loadTarget) {

                // compile baseWidget:
                document.body.innerHTML = (new Compiler()).compile(loadTarget, window.config).render();

                // initialize all <widget>'s:
                var widgets = [].slice.call(document.getElementsByTagName("widget"));
                widgets.forEach(function(widget) {
                    var api = window.instances[widget.getAttribute("id")];
                    api.createListeners();
                });
            }
        }

        document.body.addEventListener("click", function(event) {
            if (event.target.tagName.toLowerCase() == "a") {
                strategy.onClick(event);
                event.preventDefault();
                return false;
            }
        });

        window.addEventListener('popstate', function(e){
          load();
        }, false);

        load();

    });
} catch (Exception) {}
