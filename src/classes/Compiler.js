
export class Widget {

    constructor(cb, compiler) {
        this.compiler = compiler;
        this.cb = cb;
        this.cb_str = cb.toString();
    }

    render(data) {
        this.data = data;
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
            source = source.replace(
                /\$([A-Za-z0-9_.]+)/mig,
                function (m,s) { return that.extract(m, additional_scope, iternum); }
            );
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
        var data = this.data;
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
        var t = this.compiler.widgets[expression];
        if (!t) { throw new Error("template not found: "+expression);}
        return this.compiler.compile(t.default).render(this.data);
    }

    include_with(expression, additional_scope, iternum) {
        let [,template,data] = expression.match(/include:(.+?) with\s(.+?)$/);

        if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
            data = this.var(data, additional_scope, iternum);
            data = JSON.parse(data);
        }
        else data = this.extract(data);

        var t = this.compiler.widgets[template];
        if (!t) { throw new Error("template not found: "+template);}
        return this.compiler.compile(t.default).render(Object.assign({}, this.data, data));
    }
}


export class Compiler {
    constructor(cb) {
        this.widgets = (cb || function() { return {}})();
    }

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

    compile(template) {
        template = template.replace(/\s\s+/mig, " ").trim();
        template = this.chunks(template, (to_compile) => {
            return to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                return "`+this.exp(`"+s+"`)+`";
            });
        });
        return new Widget(() => { return eval('() => { return `' + template + '`}')(); }, this);
    }

}

try {
    var domReady = function(callback) {
        document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
    };

    domReady(() => {
        var compiler = new Compiler(() => {
            return window.widgets;
        });

        var widgets = [].slice.call(document.getElementsByTagName("widget"));
        widgets.forEach(function(widget) {
            widget.innerHTML = compiler.compile(widget.innerHTML).render(window.config);
            widget.style.display = 'block';
        });
    });
} catch (Exception) {}
