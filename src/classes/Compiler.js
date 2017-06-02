
export class Widget {
    constructor(cb) {
        this.cb = cb;
    }
    render(data) {
        this.data = data;
        return this.cb.call(this);
    }
    var(var_name) {
        let [path, d] = var_name.split("||");
        path = path.trim().split(".");
        d = d ? d.trim() : null;
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
        return value || d;
    }
}


export class Compiler {
    constructor() {
        console.log("Создан экземпляр task!");
    }

    compile(template) {
        template = template.replace(/{\$(.+?)}/ig, (m, s) => { return '"+this.var("'+s+'")+"'; });
        return new Widget((data) => { return eval('() => { return "' + template + '"}').call(); });
    }

}
