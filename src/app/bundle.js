(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _Compiler = require("../classes/Compiler");

window.router = {
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

var init = exports.init = function init(internal) {
    internal.bugaga = "111";
    internal.api.createListeners = function () {
        internal.broadcast("TEST_INCLUSION_INITED", { a: 42 });
    };

    internal.api.change = function (name, age) {
        internal.state.user.name = name;
        internal.state.user.age = age;
        internal.state.local_property = "xxx";
        internal.refresh();
    };

    internal.api.get_state = function () {
        return internal.state;
    };
};

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

        internal.subscribe("TEST_INCLUSION_INITED", function (e) {
            console.dir(e);internal.say("GLOBAL");
        });

        internal.subscribe("TEST_INCLUSION_INITED", function (e) {
            console.dir(e);internal.say("EXCLUSIVE");
        }, internal.includes.test_inclusion);

        internal.broadcast("TEST_INCLUSION_INITED", { "local": 55 });
    };

    internal.api.say = function () {
        internal.say();
    };

    internal.api.change = function () {
        internal.state.user.name = "Alexey";
        internal.state.user.age = 42;
        internal.refresh();
    };

    internal.say = function (msg) {
        alert(msg);
    };
};

},{"../test_inclusion":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

try {

    String.prototype.replaceAll = function (search, replacement) {
        return this.replace(new RegExp(search, 'g'), replacement);
    };

    String.prototype.trimAll = function (mask) {
        var s = this;
        while (~mask.indexOf(s[0])) {
            s = s.slice(1);
        }
        while (~mask.indexOf(s[s.length - 1])) {
            s = s.slice(0, -1);
        }
        return s;
    };

    Element.prototype.find_parent = function (css) {
        var parent = this.parentElement;
        while (parent) {
            if (parent.matches(css)) return parent;else parent = parent.parentElement;
        }
        return null;
    };
} catch (e) {}

var Filter = function () {
    function Filter(value) {
        _classCallCheck(this, Filter);

        this.value = value;
    }

    _createClass(Filter, [{
        key: "length",
        value: function length() {
            if (!this.value) return 0;
            if (this.value instanceof Object) {
                var counter = 0;
                for (var k in this.value) {
                    counter++;
                }return counter;
            }
            if (this.value === true) return 1;
            return this.value.length;
        }
    }, {
        key: "format",
        value: function format(format_str) {
            var date_obj = this.value instanceof Date ? this.value : new Date(this.value);
            if (Object.prototype.toString.call(date_obj) != "[object Date]" || isNaN(date_obj.getTime())) {
                return date;
            }
            var pad = function pad(val) {
                return String(val).length == 1 ? "0" + val : val;
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
    }, {
        key: "in",
        value: function _in(haystack) {
            var needle = this.value;
            if (needle == null || haystack == null) {
                return false;
            }
            if (typeof haystack == "string") {
                try {
                    haystack = JSON.parse(haystack);
                } catch (e) {
                    return !!(haystack.indexOf(needle) > -1);
                }
            }
            if (haystack instanceof Array) {
                return haystack.indexOf(needle) > -1;
            }
            if (haystack instanceof Object) {
                return needle in haystack;
            }
        }
    }, {
        key: "pluralword",
        value: function pluralword(words) {
            if (typeof words == "string") words = JSON.parse(words);
            var num = parseInt(this.value) % 100;
            if (num > 19) {
                num = num % 10;
            }
            return { 1: words[0], 2: words[1], 3: words[1], 4: words[1] }[num] || words[2];
        }
    }, {
        key: "html",
        value: function html() {
            return decodeURI(this.value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x2F;/g, "/"));
        }
    }, {
        key: "json",
        value: function json() {
            return JSON.stringify(this.value);
        }
    }, {
        key: "exists",
        value: function exists() {
            return this.length() > 0;
        }
    }, {
        key: "pluralform",
        value: function pluralform(words) {
            return this.value + " " + this.pluralword(words);
        }
    }, {
        key: "startswith",
        value: function startswith(prefix) {
            return this.value.indexOf(prefix) == 0;
        }
    }, {
        key: "endswith",
        value: function endswith(suffix) {
            return this.value.indexOf(suffix) == this.value.length - suffix.length;
        }
    }, {
        key: "contains",
        value: function contains(needle) {
            return new Filter(needle).in(this.value);
        }
    }]);

    return Filter;
}();

var Widget = exports.Widget = function () {
    function Widget(cb, internal, compiler) {
        var _this = this;

        _classCallCheck(this, Widget);

        this.compiler = compiler;
        this.cb = cb;
        this.internal = internal;

        this.internal.refresh = function () {
            try {
                var widget = document.getElementById(_this.internal.uid);
                var target = widget;
                if (_this.compiler.config.refresh_up && _this.compiler.config.state == "shared") {
                    do {
                        target = widget;
                        widget = widget.find_parent("widget");
                    } while (widget);
                }

                target.outerHTML = _this.compiler.instances[target.getAttribute("id")].render();
            } catch (e) {}
        };

        this.internal.subscribe = function (eName, cb, origin) {
            _this.compiler.subscribe(eName, cb, origin);
        };
        this.internal.broadcast = function (eName, message) {
            _this.compiler.broadcast(eName, message, _this.internal.api);
        };
    }

    _createClass(Widget, [{
        key: "api",
        value: function api() {
            return this.internal.api;
        }
    }, {
        key: "render",
        value: function render(state) {
            this.internal.state = state || this.internal.state;
            return this.cb().replace(/\s\s+/mig, " ");
        }
    }, {
        key: "exp",
        value: function exp(source, additional_scope, iternum) {
            var _this2 = this;

            try {
                source = source.trim();
            } catch (TypeError) {
                return "";
            }

            if (/\((.+?)\)/mig.test(source)) {
                source = source.replace(/\((.+?)\)/mig, function (m, s) {
                    return "(" + _this2.exp(s, additional_scope, iternum) + ")";
                });
            }

            if (/for (.+?) in (.+?)\s(.+?)/mig.test(source)) return this.list(source, additional_scope, iternum);
            if (/include:(.+?)/mig.test(source)) return this.include_with(source, additional_scope, iternum);
            if (/rebuild:(.+?)/mig.test(source)) return this.rebuild(source, additional_scope, iternum);
            if (/(.+?)\?(.+?)/mig.test(source)) return this.ternary(source, additional_scope, iternum);

            var seps = ["&&", "||", "==", "!=", " < ", " > ", ">=", "<="];
            for (var i = 0; i < seps.length; i++) {
                if (source.indexOf(seps[i]) > -1) {
                    var _source$split = source.split(seps[i]),
                        _source$split2 = _slicedToArray(_source$split, 2),
                        l = _source$split2[0],
                        r = _source$split2[1];

                    return this.cmp2(l, r, seps[i], additional_scope, iternum);
                }
            }

            if (source.indexOf("[") == 0 || source.indexOf("{") == 0) return source;
            return this.var(source, additional_scope, iternum);
        }
    }, {
        key: "var",
        value: function _var(source, additional_scope, iternum) {
            var that = this;
            var result = null;
            if (source.indexOf("$") > -1) {
                source = source.replace(/\$[A-Za-zА-Яа-я0-9_.]+(\|+(.+?)[\)\s])*/mig, function (m, s) {
                    return that.extract(m, additional_scope, iternum);
                });
            }

            try {
                result = eval(source);
            } catch (e) {
                result = source;
            }
            return result;
        }
    }, {
        key: "extract",
        value: function extract(path, additional_scope, iternum) {
            var value = null;
            var filter = null;
            var data = Object.assign({}, this.internal.state, additional_scope);

            if (path.indexOf("$") == 0 && path.indexOf("|") > -1) {
                ;

                var _path$split = path.split("|");

                var _path$split2 = _slicedToArray(_path$split, 2);

                path = _path$split2[0];
                filter = _path$split2[1];
            }if (iternum && path == "$i") return iternum();

            path = path.replace("$", "").trim().split(".");
            var path_part = path.shift();

            while (path_part) {
                if (path_part in data) {
                    value = data[path_part];
                    data = data[path_part];
                    path_part = path.shift();
                } else {
                    value = null;
                    path_part = null;
                }
            }

            value = this.escape(value);

            if (filter) {
                var _filter$match = filter.match(/(?:.+?)\((.*?)\)$/),
                    _filter$match2 = _slicedToArray(_filter$match, 2),
                    params = _filter$match2[1];

                if (params.length && params.indexOf('"') != 0 && params.indexOf("'") != 0 && params.indexOf('[') != 0 && params.indexOf('{') != 0) {
                    filter = filter.replace(params, '"' + params + '"');
                }

                value = eval("(new Filter(value))." + filter);
            }

            return value;
        }
    }, {
        key: "escape",
        value: function escape(obj) {
            if (typeof obj == "string") {
                var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
                return obj.replace(/[&<>"'\/]/g, function (s) {
                    return entityMap[s];
                });
            }
            return obj;
        }
    }, {
        key: "cmp2",
        value: function cmp2(v1, v2, sep, additional_scope, iternum) {
            v1 = this.exp(v1, additional_scope, iternum);
            v2 = this.exp(v2, additional_scope, iternum);
            try {
                return eval(v1 + sep + v2);
            } catch (ReferenceError) {
                try {
                    return eval(v1 + sep + '`' + v2 + '`');
                } catch (ReferenceError) {
                    try {
                        return eval('`' + v1 + '`' + sep + v2);
                    } catch (ReferenceError) {
                        return eval('`' + v1 + '`' + sep + '`' + v2 + '`');
                    }
                }
            }
        }
    }, {
        key: "ternary",
        value: function ternary(var_name, additional_scope, iternum) {
            var_name = var_name.replace(":", "?");

            var _var_name$split = var_name.split("?"),
                _var_name$split2 = _slicedToArray(_var_name$split, 3),
                path = _var_name$split2[0],
                positive = _var_name$split2[1],
                negative = _var_name$split2[2];

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

            itertemplate_compiled = eval("((widget, scope, iternum) => { return `" + itertemplate_compiled + "`; })");

            var i = 0;
            iterable.forEach(function (itervalue, num) {
                var local_scope = additional_scope || {};
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

            if (expression.indexOf("$") == 0) expression = this.extract(expression);

            var t = this.internal.includes[expression];

            if (t.uid instanceof Function || t instanceof Array) {
                t = this.internal._includes[expression];
            }

            if (!t) {
                require(expression);
            }

            var widget = this.compiler.compile(t, Object.assign({}, this.compiler.deepclone(this.internal.state), additional_scope));

            if (t.uid instanceof Function) {
                this.internal.includes[expression] = [t, widget.api()];
            } else if (t instanceof Array) {
                this.internal.includes[expression].push(widget.api());
            } else {
                if (!this.internal._includes) this.internal._includes = {};
                this.internal._includes[expression] = t;
                this.internal.includes[expression] = widget.api();
            }

            return widget.render();
        }
    }, {
        key: "scope",
        value: function scope(data, additional_scope, iternum) {
            if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
                data = this.var(data, additional_scope, iternum);
                data = JSON.parse(data);
            } else data = this.extract(data);

            return Object.assign({}, this.compiler.deepclone(this.internal.state), data);
        }
    }, {
        key: "include_with",
        value: function include_with(expression, additional_scope, iternum) {
            if (expression.indexOf("with") > -1) {
                var _expression$match3 = expression.match(/include:(.+?) with\s(.+?)$/),
                    _expression$match4 = _slicedToArray(_expression$match3, 3),
                    template = _expression$match4[1],
                    data = _expression$match4[2];

                additional_scope = this.scope(data, additional_scope, iternum);
                expression = template;
            }
            return this.include(expression, additional_scope, iternum);
        }
    }, {
        key: "rebuild",
        value: function rebuild(expression, additional_scope, iternum) {
            var _expression$match5 = expression.match(/rebuild:(.+?) with\s(.+?)$/),
                _expression$match6 = _slicedToArray(_expression$match5, 3),
                template = _expression$match6[1],
                data = _expression$match6[2];

            return this.include(template, this.scope(data, additional_scope, iternum), iternum);
        }
    }]);

    return Widget;
}();

var ControllerFactory = function () {
    function ControllerFactory(router) {
        _classCallCheck(this, ControllerFactory);

        this.router = {};
        for (var routePattern in router) {
            this.router[routePattern.trimAll("/")] = router[routePattern];
        };
    }

    _createClass(ControllerFactory, [{
        key: "extractParameters",
        value: function extractParameters(url, routePattern) {
            var result = {};
            var names = routePattern.trimAll("/").split("/");
            var values = url.trimAll("/").split("/");

            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                if (new RegExp("<.+?>").test(name)) {
                    var trimmedName = name.replaceAll("<", "").replaceAll(">", "");
                    result[trimmedName] = values[i];
                }
            }
            return result;
        }
    }, {
        key: "get",
        value: function get(url) {
            url = url.trimAll("/");

            var fast_acs_controller = this.router[url];
            if (fast_acs_controller != null) return { "controller": fast_acs_controller, "request": {} };

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
            if (best_controller) return { "controller": best_controller, "request": best_controller_request };
            throw new Error("404 NotFound");
        }
    }, {
        key: "isMatch",
        value: function isMatch(url, routePattern) {
            routePattern = "^" + routePattern + "$";
            return new RegExp(routePattern.trimAll("/").replaceAll("(<(.+?)>)", "(.+?)")).test(url.trimAll("/"));
        }
    }]);

    return ControllerFactory;
}();

var Compiler = exports.Compiler = function () {
    function Compiler(router, config) {
        _classCallCheck(this, Compiler);

        this.router = router || {};
        this.config = config || {};
        this.instances = {};
        this.subscriptions = {};
        this.uids_cache = {};
        this.router.strategy = this.router.strategy || new HashStrategy();

        this.controllerFactory = new ControllerFactory(this.router);

        this.initDomListeners();
    }

    _createClass(Compiler, [{
        key: "initDomListeners",
        value: function initDomListeners() {
            var _this3 = this;

            try {
                document.body.addEventListener("click", function (event) {
                    if (event.target.tagName.toLowerCase() == "a") {
                        _this3.router.strategy.onClick(event);
                        event.preventDefault();
                    }
                });

                window.addEventListener('popstate', function (e) {
                    _this3.load();
                }, false);
            } catch (ReferenceError) {}
        }
    }, {
        key: "deepclone",
        value: function deepclone(source) {
            if (this.config.state == "shared") return source;
            var destination = {};
            for (var property in source) {
                if (_typeof(source[property]) === "object" && source[property] !== null) {
                    destination[property] = this.deepclone(source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        }
    }, {
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
            var p = function p() {
                return ("000" + (Math.random() * 46656 | 0).toString(36)).slice(-3);
            };
            return p() + p();
        }
    }, {
        key: "generateUID2",
        value: function generateUID2(t) {
            // TODO: it is not good idea to use the whole temlate as a key...
            // We should use a hash, but there is no md5 function in raw js
            if (this.uids_cache[t.template]) return this.uids_cache[t.template];else {
                var uid = this.generateUID();
                this.uids_cache[t.template] = uid;
                return uid;
            }
        }
    }, {
        key: "compile",
        value: function compile(t, state, includes) {

            var uid = this.generateUID2(t);
            var prev_state = this.instances[uid] ? this.instances[uid].internal.state : {};
            var internal = new Internal(uid, Object.assign(prev_state, state), includes);

            if (t.init) t.init(internal);

            var template;
            try {
                if (window) {
                    template = '<widget id="' + uid + '">' + t.template + '</widget>';
                }
            } catch (ReferenceError) {
                template = t.template;
            }

            template = template.replace(/\s\s+/mig, " ").trim();
            template = this.chunks(template, function (to_compile) {
                return to_compile.replace(/{((.|\n)+)}/ig, function (m, s) {
                    return "`+this.exp(`" + s + "`)+`";
                });
            });

            this.instances[uid] = new Widget(function () {
                return eval('() => { return `' + template + '`}')();
            }, internal, this);

            return this.instances[uid];
        }
    }, {
        key: "compileTarget",
        value: function compileTarget(target) {
            return this.compile(target.controller, Object.assign({}, this.config, { "request": target.request }));
        }
    }, {
        key: "load",
        value: function load(url) {
            var _this4 = this;

            this.clear();

            var loadTarget = this.getLoadTarget();

            if (loadTarget) {
                document.body.innerHTML = this.compileTarget(loadTarget).render();

                var widgets = [].slice.call(document.getElementsByTagName("widget"));
                widgets.forEach(function (widget) {
                    var api = _this4.instances[widget.getAttribute("id")].api();
                    api.createListeners();
                });
            }
        }
    }, {
        key: "getLoadTarget",
        value: function getLoadTarget(url) {
            return this.controllerFactory.get(url || this.router.strategy.getCurrentLocation());
        }
    }, {
        key: "clear",
        value: function clear() {
            this.instances = {};
            this.subscriptions = {};
        }
    }, {
        key: "subscribe",
        value: function subscribe(eventName, cb, origin) {
            if (!this.subscriptions[eventName]) this.subscriptions[eventName] = [];
            this.subscriptions[eventName].push([cb, origin]);
        }
    }, {
        key: "broadcast",
        value: function broadcast(eventName, message, origin) {
            if (this.subscriptions[eventName]) {
                this.subscriptions[eventName].forEach(function (data) {
                    var cb = data[0];
                    var required_origin = data[1];
                    if (!required_origin) cb(message, origin);else {
                        (required_origin instanceof Array ? required_origin : [required_origin]).forEach(function (obj) {
                            if (obj.uid && obj.uid() == origin.uid()) cb(message, obj);
                        });
                    }
                });
            }
        }
    }]);

    return Compiler;
}();

var Internal = function Internal(uid, state, includes) {
    var _this5 = this;

    _classCallCheck(this, Internal);

    this.uid = uid;
    this.api = {
        createListeners: function createListeners() {},
        uid: function uid() {
            return _this5.uid;
        }
    };
    this.state = state || {};
    this.includes = includes || {};
};

var HashStrategy = exports.HashStrategy = function () {
    function HashStrategy() {
        _classCallCheck(this, HashStrategy);
    }

    _createClass(HashStrategy, [{
        key: "getCurrentLocation",
        value: function getCurrentLocation() {
            return (location.hash || "/").replace("#", "");
        }
    }, {
        key: "onClick",
        value: function onClick(event) {
            var href = event.target.href;
            if (location.protocol == "file:" && href.indexOf("file://") == 0) href = href.replace("file://", "");
            location.hash = href;
        }
    }]);

    return HashStrategy;
}();

try {

    var domReady = function domReady(callback) {
        document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
    };

    domReady(function () {
        window.compiler = new Compiler(window.router, window.config);
        window.compiler.load();
    });
} catch (e) {}

},{}]},{},[1]);
