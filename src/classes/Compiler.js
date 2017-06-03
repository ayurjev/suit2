
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

    exp(source) {

        if (/\((.+?)\)/mig.test(source)) {
            source = source.replace(/\((.+?)\)/mig, (m,s) => {
                return "("+this.exp(s)+")";
            })
        }

        return this.var(source);
    }

    var(source) {
        if (source === undefined) return "";

        if (/(.+?)\?(.+?)\: (.+?)/mig.test(source)) return this.ternary(source);
        if (/(.+?)\?(.+?)/mig.test(source)) return this.ternary(source);

        if (/(.+?)&&(.+?)/mig.test(source)) return this.cmp(source, "&&");
        if (/(.+?)\|\|(.+?)/mig.test(source)) return this.cmp(source, "||");
        if (/(.+?)==(.+?)/mig.test(source)) return this.cmp(source, "==");
        if (/(.+?)==(.+?)/mig.test(source)) return this.cmp(source, "!=");
        if (/(.+?)<(.+?)/mig.test(source)) return this.cmp(source, "<");
        if (/(.+?)>(.+?)/mig.test(source)) return this.cmp(source, ">");
        if (/(.+?)<=(.+?)/mig.test(source)) return this.cmp(source, "<=");
        if (/(.+?)>=(.+?)/mig.test(source)) return this.cmp(source, ">=");

        source = source.trim();

        if (source.indexOf("$") > -1) {
            source = source.replace(/\$([A-Za-z0-9_.]+)/mig, (m,s) => { return this.extract(s); });
        }

        try {
            return eval(source);
        } catch (Exception){
            return source;
        }
    }

    extract(path) {
        path = path.trim().split(".");
        var data = this.data;
        var value = null;
        var path_part = path.shift();

        while (path_part) {
            if (path_part in data) {
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

    cmp(var_name, sep) {
        let [v1, v2] = var_name.split(sep);
        if (sep == "||") {
            try {
                return eval(this.exp(v1) + sep + this.exp(v2));
            } catch (ReferenceError) {
                return eval(this.exp(v1) + sep + '`' + this.exp(v2) + '`');
            }
        }
        return eval(this.exp(v1) + sep + this.exp(v2));
    }

    ternary(var_name) {
        var_name = var_name.replace(":", "?");
        let [path, positive, negative] = var_name.split("?");
        return this.var(path) ? this.var(positive) : this.var(negative);
    }
}


export class Compiler {
    constructor() {}

    compile(template) {
        template = template.replace(/{((.|\n)+?)}/mig, (m, s) => {
            return '"+this.exp("'+s+'")+"';
        });
        template = template.replace(/\s\s+/mig, " ").trim();
        return new Widget((data) => { return eval('() => { return "' + template + '"}').call(); });
    }

}
