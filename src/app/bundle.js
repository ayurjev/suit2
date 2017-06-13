(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _Compiler = require("../classes/Compiler");

window.router = {
    "strategy": "hash",

    "/": require("./widgets/Main"),
    "/page1/": require("./test_inclusion"),
    "/page1/subpage/": require("./subpage")
};

window.config = { user: { name: "Andrey", age: 28 } };

},{"../classes/Compiler":5,"./subpage":2,"./test_inclusion":3,"./widgets/Main":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = exports.template = "subpage content";

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = exports.template = "His name is <b>{$user.name}</b> and he is {$user.age} years old";

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var template = exports.template = "\n    <div>\n        His <a href=\"/page1/\">name</a> is <b>{$user.name}</b> and he is {$user.age} <a href=\"/page1/subpage/\">years</a> old<br />\n        {include:test_inclusion}\n    </div>\n";

var init = exports.init = function init(internal) {

    internal.includes = {
        "test_inclusion": require("../test_inclusion")
    };

    internal.api.createListeners = function () {
        //internal.say();
    };

    internal.api.say = function () {
        internal.say();
    };

    internal.say = function () {
        alert("hello");
    };
};

},{"../test_inclusion":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = exports.Widget = function () {
    function Widget(cb, includes, compiler) {
        _classCallCheck(this, Widget);

        this.compiler = compiler;
        this.cb = cb;
        this.includes = includes;
        this.cb_str = cb.toString();
    }

    _createClass(Widget, [{
        key: "render",
        value: function render(data) {
            this.data = data;
            var result = this.cb();
            result = result.replace(/\s\s+/mig, " ");
            return result;
        }
    }, {
        key: "exp",
        value: function exp(source, additional_scope, iternum) {
            var _this = this;

            if (source === undefined) return "";

            source = source.trim();

            if (/\((.+?)\)/mig.test(source)) {
                source = source.replace(/\((.+?)\)/mig, function (m, s) {
                    return "(" + _this.exp(s, additional_scope, iternum) + ")";
                });
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
    }, {
        key: "var",
        value: function _var(source, additional_scope, iternum) {
            var that = this;

            if (source.indexOf("$") > -1) {
                source = source.replace(/\$([A-Za-z0-9_.]+)/mig, function (m, s) {
                    return that.extract(m, additional_scope, iternum);
                });
            }

            try {
                return eval(source);
            } catch (Exception) {
                return source;
            }
        }
    }, {
        key: "extract",
        value: function extract(path, additional_scope, iternum) {
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
                } else if (path_part in data) {
                    value = data[path_part];
                    data = data[path_part];
                    path_part = path.shift();
                } else {
                    path_part = null;
                    value = null;
                }
            }
            return value;
        }
    }, {
        key: "cmp",
        value: function cmp(var_name, sep, additional_scope, iternum) {
            var _var_name$split = var_name.split(sep),
                _var_name$split2 = _slicedToArray(_var_name$split, 2),
                v1 = _var_name$split2[0],
                v2 = _var_name$split2[1];

            if (sep == "||") {
                try {
                    return eval(this.exp(v1, additional_scope, iternum) + sep + this.exp(v2, additional_scope, iternum));
                } catch (ReferenceError) {
                    return eval(this.exp(v1, additional_scope, iternum) + sep + '`' + this.exp(v2, additional_scope, iternum) + '`');
                }
            }
            return eval(this.exp(v1, additional_scope, iternum) + sep + this.exp(v2, additional_scope, iternum));
        }
    }, {
        key: "ternary",
        value: function ternary(var_name, additional_scope, iternum) {
            var_name = var_name.replace(":", "?");

            var _var_name$split3 = var_name.split("?"),
                _var_name$split4 = _slicedToArray(_var_name$split3, 3),
                path = _var_name$split4[0],
                positive = _var_name$split4[1],
                negative = _var_name$split4[2];

            return this.exp(path, additional_scope, iternum) ? this.exp(positive, additional_scope, iternum) : this.exp(negative, additional_scope, iternum);
        }
    }, {
        key: "list",
        value: function list(expression, additional_scope, iternum) {
            var _expression$match = expression.match(/for (.+?) in (.+?)\s(.+?)$/),
                _expression$match2 = _slicedToArray(_expression$match, 4),
                iterkey = _expression$match2[1],
                iterable = _expression$match2[2],
                itertemplate = _expression$match2[3];

            itertemplate = itertemplate.replace(/\s\s+/mig, " ").trim();
            iterkey = iterkey.replace("$", "");

            if (iterable.indexOf("[") == 0 || iterable.indexOf("{") == 0) iterable = JSON.parse(iterable);else iterable = this.extract(iterable);

            var out = "";
            var that = this;

            if (itertemplate[0] != "{") itertemplate = "{" + itertemplate + "}";

            var itertemplate_compiled = this.compiler.chunks(itertemplate, function (to_compile) {
                return to_compile.replace(/{((.|\n)+)}/ig, function (m, s) {
                    return "` + ((widget, scope, iternum) => { return widget.exp(`" + s + "`, scope, iternum); })(widget, scope, iternum) + `";
                });
            });

            itertemplate_compiled = "((widget, scope, iternum) => { return `" + itertemplate_compiled + "`; })";
            itertemplate_compiled = eval(itertemplate_compiled);

            var i = 0;
            iterable.forEach(function (itervalue, num) {
                var local_scope = Object.assign(additional_scope || {});
                local_scope[iterkey] = itervalue;
                out += itertemplate_compiled(that, local_scope, function () {
                    i++;return i;
                });
            });

            return out;
        }
    }, {
        key: "include",
        value: function include(expression, additional_scope, iternum) {

            expression = expression.replace("include:", "").trim();

            var t = this.includes[expression];

            if (!t) {
                require(expression);
            }

            return this.compiler.build(t).render(this.data);
        }
    }, {
        key: "include_with",
        value: function include_with(expression, additional_scope, iternum) {
            var _expression$match3 = expression.match(/include:(.+?) with\s(.+?)$/),
                _expression$match4 = _slicedToArray(_expression$match3, 3),
                template = _expression$match4[1],
                data = _expression$match4[2];

            if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
                data = this.var(data, additional_scope, iternum);
                data = JSON.parse(data);
            } else data = this.extract(data);

            return this.include(template, Object.assign({}, this.data, data), iternum);
        }
    }]);

    return Widget;
}();

var Compiler = exports.Compiler = function () {
    function Compiler() {
        _classCallCheck(this, Compiler);
    }

    _createClass(Compiler, [{
        key: "chunks",
        value: function chunks(template, compile_cb) {
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

                var next_start = template.slice(p + 1, template.length).indexOf("{");
                if (next_start > -1) start = p + next_start + 1;else start = -1;

                repl[to_compile] = compiled;
            }

            for (to_compile in repl) {
                template = template.replace(to_compile, repl[to_compile]);
            }

            return template;
        }
    }, {
        key: "generateUID",
        value: function generateUID() {
            var firstPart = Math.random() * 46656 | 0;
            var secondPart = Math.random() * 46656 | 0;
            firstPart = ("000" + firstPart.toString(36)).slice(-3);
            secondPart = ("000" + secondPart.toString(36)).slice(-3);
            return firstPart + secondPart;
        }
    }, {
        key: "build",
        value: function build(t) {
            var uid = this.generateUID();

            var internal = { api: { createListeners: function createListeners() {} }, includes: {} };

            if (t.init) t.init(internal);

            window.instances[uid] = internal.api;

            var template = '<widget id="' + uid + '" style="display: none;">' + t.template + '</widget>';

            return this.compile(template, internal.includes);
        }
    }, {
        key: "compile",
        value: function compile(template, includes) {
            includes = includes || {};
            template = template.replace(/\s\s+/mig, " ").trim();
            template = this.chunks(template, function (to_compile) {
                return to_compile.replace(/{((.|\n)+)}/ig, function (m, s) {
                    return "`+this.exp(`" + s + "`)+`";
                });
            });
            return new Widget(function () {
                return eval('() => { return `' + template + '`}')();
            }, includes, this);
        }
    }]);

    return Compiler;
}();

try {
    var domReady = function domReady(callback) {
        document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
    };

    domReady(function () {

        window.instances = {};

        var compiler = new Compiler();

        var load = function load(url) {

            url = url || function () {
                var url = location.hash || "/";
                url = url.replace("#", "");
                return url;
            }();

            var loadTarget = window.router[url];

            if (loadTarget) {

                var baseWidget = compiler.build(loadTarget);

                document.body.innerHTML = baseWidget.render(window.config);

                var widgets = [].slice.call(document.getElementsByTagName("widget"));
                widgets.forEach(function (widget) {
                    var api = window.instances[widget.getAttribute("id")];
                    api.createListeners();
                    widget.style.display = 'block';
                });
            }
        };

        document.body.addEventListener("click", function (event) {
            if (event.target.tagName.toLowerCase() == "a") {
                var href = event.target.href;
                if (location.protocol == "file:" && href.indexOf("file://") == 0) href = href.replace("file://", "");
                location.hash = href;
                event.preventDefault();
                return false;
            }
        });

        window.addEventListener('popstate', function (e) {
            load();
        }, false);

        load();
    });
} catch (Exception) {}

},{}]},{},[1]);
