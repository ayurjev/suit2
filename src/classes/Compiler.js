
export class Widget {

    constructor(cb) {
        this.cb = cb;
    }

    render(data) {
        this.data = data;
        var result = this.cb.call(this);
        result = result.replace(/\s\s+/mig, " ");
        return result;
    }

    exp(source, additional_scope) {

        if (/\((.+?)\)/mig.test(source)) {
            source = source.replace(/\((.+?)\)/mig, (m,s) => {
                return "("+this.exp(s, additional_scope)+")";
            })
        }

        return this.var(source, additional_scope);
    }

    var(source, additional_scope) {
        if (source === undefined) return "";

        // source.replace(/{((.|\n)+)}/ig, (m, s) => {
        //     console.dir("found: ", m);
        //     return '"+this.exp("'+s+'")+"';
        // });

        if (/for (.+?) in (.+?)\s(.+?)/mig.test(source)) return this.list(source, additional_scope);

        if (/(.+?)\?(.+?)\: (.+?)/mig.test(source)) return this.ternary(source, additional_scope);
        if (/(.+?)\?(.+?)/mig.test(source)) return this.ternary(source, additional_scope);

        if (/(.+?)&&(.+?)/mig.test(source)) return this.cmp(source, "&&", additional_scope);
        if (/(.+?)\|\|(.+?)/mig.test(source)) return this.cmp(source, "||", additional_scope);
        if (/(.+?)==(.+?)/mig.test(source)) return this.cmp(source, "==", additional_scope);
        if (/(.+?)==(.+?)/mig.test(source)) return this.cmp(source, "!=", additional_scope);
        if (/(.+?) < (.+?)/mig.test(source)) return this.cmp(source, "<", additional_scope);
        if (/(.+?) > (.+?)/mig.test(source)) return this.cmp(source, ">", additional_scope);
        if (/(.+?)<=(.+?)/mig.test(source)) return this.cmp(source, "<=", additional_scope);
        if (/(.+?)>=(.+?)/mig.test(source)) return this.cmp(source, ">=", additional_scope);

        source = source.trim();

        if (source.indexOf("$") > -1) {
            source = source.replace(/\$([A-Za-z0-9_.]+)/mig, (m,s) => { return this.extract(m, additional_scope); });
        }

        try {
            return eval(source);
        } catch (Exception){
            return source;
        }
    }

    extract(path, additional_scope) {
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

    cmp(var_name, sep, additional_scope) {
        let [v1, v2] = var_name.split(sep);
        if (sep == "||") {
            try {
                return eval(this.exp(v1, additional_scope) + sep + this.exp(v2, additional_scope));
            } catch (ReferenceError) {
                return eval(this.exp(v1, additional_scope) + sep + '`' + this.exp(v2, additional_scope) + '`');
            }
        }
        return eval(this.exp(v1, additional_scope) + sep + this.exp(v2, additional_scope));
    }

    ternary(var_name, additional_scope) {
        var_name = var_name.replace(":", "?");
        let [path, positive, negative] = var_name.split("?");
        return this.var(path, additional_scope) ? this.var(positive, additional_scope) : this.var(negative, additional_scope);
    }

    list(expression, additional_scope) {

        let [,iterkey,iterable,itertemplate] = expression.match(/for (.+?) in (.+?)\s(.+?)$/);
        itertemplate = itertemplate.replace(/\s\s+/mig, " ").trim();

        iterkey = "$"+iterkey;
        var out = "";
        var that = this;

        if (itertemplate[0] != "{") itertemplate = "{" + itertemplate + "}";

        var itertemplate_compiled = itertemplate.replace(/{((.|\n)+)}/ig, (m, s) => {
            return '(widget, scope) => { return widget.exp("'+s+'", scope); }';
        });

        itertemplate_compiled = eval(itertemplate_compiled);

        this.extract(iterable).forEach(function(itervalue, num) {
            var local_scope = Object.assign(additional_scope || {}, {"i": num + 1});;
            local_scope[iterkey.replace("$$", "").replace("$", "")] = itervalue;
            out += itertemplate_compiled(that, local_scope);
        });

        return out;
    }
}


export class Compiler {
    constructor() {}

    chunks(template) {
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
                var compiled = to_compile.replace(/{((.|\n)+)}/ig, (m, s) => {
                    return '"+this.exp("'+s+'")+"';
                });

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
        template = this.chunks(template);
        return new Widget((data) => { return eval('() => { return "' + template + '"}').call(); });
    }

}
