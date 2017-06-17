
class Filter {
    constructor(value) {
        this.value = value;
    }

    length() {
        return this.value.length;
    }

    startswith(prefix) {
        return this.value.indexOf(prefix) == 0;
    }

    endswith(suffix) {
        return this.value.indexOf(suffix) == this.value.length - suffix.length;
    }

    format(format_str) {
        var date_obj;
        if (this.value instanceof Date) date_obj = this.value;
        else date_obj = new Date(this.value);

        if (Object.prototype.toString.call(date_obj) != "[object Date]" || isNaN(date_obj.getTime())) {
            return date;
        }
        var pad = function (val) {
            val = String(val);
            return val.length == 1 ? "0" + val : val;
        };
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
        if (typeof(haystack) == "string") {
            try {
                haystack = JSON.parse(haystack);
            } catch (e) {}
        }
        if (needle == null || haystack == null) { return false }
        if (typeof(haystack) == "string"){ return !!(haystack.indexOf(needle) > -1); }
        else if (haystack instanceof Array) {
            for (var i in haystack) { if (haystack[i] == needle)  { return true; } }
            return false;
        }
        else if (haystack instanceof Object) { return (needle in haystack); } else { return false; }
    };

    contains(needle) {
        return new Filter(needle).in(this.value);
    };

}

export class Widget {

    constructor(cb, internal, compiler) {
        this.compiler = compiler;
        this.cb = cb;
        this.internal = internal;
        this.internal.api._render = this.render;

        this.internal.refresh = () => {
            try {
                /**
                 *  find_parent polyfill
                 */
                (function(e){
                    e.find_parent = function(css) {
                        var parent = this.parentElement;

                        while (parent) {
                            if (parent.matches(css)) return parent;
                            else parent = parent.parentElement;
                        }
                        return null;
                    }
                })(Element.prototype);

                var widget = document.getElementById(this.internal.uid);

                var target = widget;
                if (this.compiler.config.refresh_up && this.compiler.config.state == "shared") {
                    do {
                        target = widget;
                        widget = widget.find_parent("widget");
                    } while (widget)
                }

                target.outerHTML = this.compiler.instances[target.getAttribute("id")].render();

            } catch (ReferenceError) {
                // it's ok... no document object... tests...
            }
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
        return result.replace(/\s\s+/mig, " ");
    }

    exp(source, additional_scope, iternum) {
        if (source === undefined) return "";
        source = source.trim();

        if (/\((.+?)\)/mig.test(source)) {
            source = source.replace(/\((.+?)\)/mig, (m,s) => {
                if (s.indexOf('"') == 0 || s.indexOf("'") == 0) {
                    return "(" + s + ")";
                }
                return "(" + this.exp(s, additional_scope, iternum) + ")";
            });
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

        if (source.indexOf("[") == 0 || source.indexOf("{") == 0) return source;

        return this.var(source, additional_scope, iternum);
    }

    var(source, additional_scope, iternum) {
        var that = this;

        if (source.indexOf("$") > -1) {
            source = source.replace(
                /\$([A-Za-z0-9_.]+(\|[A-Za-z0-9_.\(\)\"\'%$,\[\]]+)*)/mig,
                function (m,s) {
                    var extracted_value = that.extract(m, additional_scope, iternum);
                    if (extracted_value instanceof Array) extracted_value = JSON.stringify(extracted_value);
                    return extracted_value;
                }
            );
        }


        var result = null;
        try {
            result = eval(source);
        } catch (Exception){
            result = source;
        }

        return result;
    }

    extract(path, additional_scope, iternum) {
        var filter = null;
        if (path.indexOf("$") == 0 && path.indexOf("|") > -1) [path, filter] = path.split("|");

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

        if (filter) {
            var params;
            if (filter.indexOf(")") != filter.length - 1) filter = filter + "()";
            else {
                [,,params] = filter.match(/(.+?)\((.+?)\)$/);
                if (params.indexOf('"') != 0 && params.indexOf("'") != 0 && params.indexOf('[') != 0 && params.indexOf('{') != 0) {
                    filter = filter.replace(params, '"' + params + '"');
                }
            }
            value = eval("(new Filter(value))." + filter);
        }
        return value;
    }

    cmp(var_name, sep, additional_scope, iternum) {
        let [v1, v2] = var_name.split(sep);
        if (sep == "||") {
            try {
                return eval(this.exp(v1, additional_scope, iternum) + sep + this.exp(v2, additional_scope, iternum));
            } catch (ReferenceError) {
                try {
                    return eval(this.exp(v1, additional_scope, iternum) + sep + '`' + this.exp(v2, additional_scope, iternum) + '`');
                } catch (ReferenceError) {
                    try {
                        return eval('`' + this.exp(v1, additional_scope, iternum) + '`' + sep + this.exp(v2, additional_scope, iternum));
                    } catch (ReferenceError) {
                        return eval('`' + this.exp(v1, additional_scope, iternum) + '`' + sep + '`' + this.exp(v2, additional_scope, iternum) + '`');
                    }
                }
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

        if (t.uid instanceof Function || t instanceof Array) {
            t = this.internal._includes[expression];
        }

        if (!t) { require(expression); }

        var widget = this.compiler.compile(t, Object.assign({},  this.compiler.deepclone(this.internal.state), additional_scope));

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

    include_with(expression, additional_scope, iternum) {
        let [,template,data] = expression.match(/include:(.+?) with\s(.+?)$/);

        if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
            data = this.var(data, additional_scope, iternum);
            data = JSON.parse(data);
        }
        else data = this.extract(data);

        return this.include(template, Object.assign({}, this.compiler.deepclone(this.internal.state), data), iternum);
    }

    rebuild(expression, additional_scope, iternum) {
        let [,template,data] = expression.match(/rebuild:(.+?) with\s(.+?)$/);

        if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
            data = this.var(data, additional_scope, iternum);
            data = JSON.parse(data);
        }
        else data = this.extract(data);

        return this.include(template, Object.assign({}, this.compiler.deepclone(this.internal.state), data), iternum);
    }
}


export class Compiler {
    constructor(config) {
        this.config = config || {};
        this.instances = {};
        this.uids_cache = {};
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

            for (to_compile in repl) {
                template = template.replace(to_compile, repl[to_compile]);
            }

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

    build_internal(uid, state, includes, t) {
        return {
            uid: uid,
            api: {createListeners: ()=>{}, uid: () => { return uid; }},
            state: state,
            includes: includes
        };
    }

    compile(t, state, includes) {
        var uid = this.generateUID2(t);

        var prev_state = {};
        if (this.instances[uid]) {
            prev_state = this.instances[uid].internal.state;
        }

        state = state || {};
        includes = includes || {};
        var internal = this.build_internal(uid, Object.assign(prev_state, state), includes, t);

        if (t.init) t.init(internal);

        var template;

        try {
            // if there is a window object:
            if (window) {
                this.instances[uid] = internal.api;
                template = '<widget id="' + uid + '">'+t.template+'</widget>';
            }
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

        var widget = new Widget(() => { return eval('() => { return `' + template + '`}')(); }, internal, this);

        try {
            this.instances[uid] = widget;
        }
        // no window object:
        catch (Exception) {}

        return widget;
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
        window.compiler = new Compiler();
        window.clear = () => {
            // init/clear instances storage:
            compiler.instances = {};

            // init/clear subscriptions:
            window.subscriptions = {};
        }

        window.clear();

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
                        (required_origin instanceof Array ? required_origin : [required_origin]).forEach((obj) => {
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
                document.body.innerHTML = window.compiler.compile(loadTarget, window.config).render();

                // initialize all <widget>'s:
                var widgets = [].slice.call(document.getElementsByTagName("widget"));
                widgets.forEach(function(widget) {
                    var api = window.compiler.instances[widget.getAttribute("id")].api();
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
            window.clear();
          load();
        }, false);

        load();

    });
} catch (Exception) {}
