
export class Widget {
    constructor(cb) {
        this.cb = cb;
    }
    render(data) {
        this.data = data;
        return this.cb.call(this);
    }
    var(var_name) {
        if (/(.+?)\?(.+?)\: (.+?)/ig.test(var_name)) return this.ternary_full(var_name);
        if (/(.+?)\?(.+?)/ig.test(var_name)) return this.ternary_short(var_name);
        if (/(.+?)\|\|(.+?)/ig.test(var_name)) return this.var_or_default(var_name);
        return this.varValue(var_name);
    }

    varValue(source) {
        if (/(.+?)==(.+?)/ig.test(source)) return this.cmp(source, "==");
        if (/(.+?)<(.+?)/ig.test(source)) return this.cmp(source, "<");
        if (/(.+?)>(.+?)/ig.test(source)) return this.cmp(source, ">");

        var path = source.trim().split(".");
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

        if (!value) {
            try {
                return eval(source);
            } catch (Exception) {
                return value;
            }
        }
        return value;

    }

    var_or_default(var_name) {
        let [path, d] = var_name.split("||");
        return this.varValue(path) || (d ? d.trim() : null);
    }

    cmp(var_name, sep) {
        let [v1, v2] = var_name.split(sep);
        return eval(this.varValue(v1) + sep + this.varValue(v2));
    }

    ternary_full(var_name) {
        var_name = var_name.replace(":", "?");
        let [path, positive, negative] = var_name.split("?");
        return this.varValue(path) ? positive.trim() : negative.trim();
    }

    ternary_short(var_name) {
        let [path, positive] = var_name.split("?");
        return this.varValue(path) ? positive : "";
    }
}


export class Compiler {
    constructor() {}

    compile(template) {
        template = template.replace(/{\$(.+?)}/ig, (m, s) => { return '"+this.var("'+s+'")+"'; });

        return new Widget((data) => { return eval('() => { return "' + template + '"}').call(); });
    }

}
