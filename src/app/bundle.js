(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _Compiler = require("../classes/Compiler");

window.router = {
    "strategy": new _Compiler.HashStrategy(),

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

    internal.api.createListeners = function () {
        internal.broadcast("TEST_INCLUSION_INITED", { a: 42 });
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
        //internal.say();
        internal.subscribe("TEST_INCLUSION_INITED", function (e) {
            console.dir(e);internal.say();
        });
    };

    internal.api.say = function () {
        internal.say();
    };

    internal.api.change = function () {
        internal.state.user.name = "Alexey";
        internal.state.user.age = 42;
        internal.refresh();
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
    function Widget(cb, internal, compiler) {
        var _this = this;

        _classCallCheck(this, Widget);

        this.compiler = compiler;
        this.cb = cb;
        this.internal = internal;

        this.internal.refresh = function (forcedState) {
            document.getElementById(_this.internal.uid).outerHTML = _this.render(forcedState);
        };

        this.internal.subscribe = function (eventName, cb, origin) {
            window.subscribe(eventName, cb, origin);
        };

        this.internal.broadcast = function (eventName, message) {
            window.broadcast(eventName, message, _this.internal.api);
        };
    }

    _createClass(Widget, [{
        key: "render",
        value: function render(state) {
            this.internal.state = state || this.internal.state;
            var result = this.cb();
            result = result.replace(/\s\s+/mig, " ");
            return result;
        }
    }, {
        key: "exp",
        value: function exp(source, additional_scope, iternum) {
            var _this2 = this;

            if (source === undefined) return "";

            source = source.trim();

            if (/\((.+?)\)/mig.test(source)) {
                source = source.replace(/\((.+?)\)/mig, function (m, s) {
                    return "(" + _this2.exp(s, additional_scope, iternum) + ")";
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

            return this.var(source, additional_scope, iternum);
        }
    }, {
        key: "var",
        value: function _var(source, additional_scope, iternum) {
            var that = this;

            if (source.indexOf("$") > -1) {

                var default_value = null;
                if (source.indexOf("$") == 0 && source.indexOf(":") > -1) {
                    ;

                    var _source$split = source.split(":");

                    var _source$split2 = _slicedToArray(_source$split, 2);

                    source = _source$split2[0];
                    default_value = _source$split2[1];
                }if (default_value) {
                    source = that.extract(source, additional_scope, iternum) || default_value;
                } else {
                    source = source.replace(/\$([A-Za-z0-9_.]+)/mig, function (m, s) {
                        return that.extract(m, additional_scope, iternum);
                    });
                }
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
            var data = this.internal.state;
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

            var t = this.internal.includes[expression];

            if (!t) {
                require(expression);
            }

            return this.compiler.compile(t, Object.assign({}, this.internal.state, additional_scope)).render();
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

            return this.include(template, Object.assign({}, this.internal.state, data), iternum);
        }
    }, {
        key: "rebuild",
        value: function rebuild(expression, additional_scope, iternum) {
            var _expression$match5 = expression.match(/rebuild:(.+?) with\s(.+?)$/),
                _expression$match6 = _slicedToArray(_expression$match5, 3),
                template = _expression$match6[1],
                data = _expression$match6[2];

            if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
                data = this.var(data, additional_scope, iternum);
                data = JSON.parse(data);
            } else data = this.extract(data);

            return this.include(template, Object.assign({}, this.internal.state, data), iternum);
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
            var p = function p() {
                return ("000" + (Math.random() * 46656 | 0).toString(36)).slice(-3);
            };
            return p() + p();
        }
    }, {
        key: "build_internal",
        value: function build_internal(_uid, state, includes) {
            return {
                uid: _uid,
                api: { createListeners: function createListeners() {}, uid: function uid() {
                        return _uid;
                    } },
                state: state,
                includes: includes
            };
        }
    }, {
        key: "compile",
        value: function compile(t, state, includes) {
            var uid = this.generateUID();

            state = state || {};
            includes = includes || {};
            var internal = this.build_internal(uid, state, includes);

            if (t.init) t.init(internal);

            var template;

            try {
                window.instances[uid] = internal.api;
                template = '<widget id="' + uid + '">' + t.template + '</widget>';
            }
            // no window object:
            catch (Exception) {
                template = t.template;
            }

            template = template.replace(/\s\s+/mig, " ").trim();
            template = this.chunks(template, function (to_compile) {
                return to_compile.replace(/{((.|\n)+)}/ig, function (m, s) {
                    return "`+this.exp(`" + s + "`)+`";
                });
            });

            return new Widget(function () {
                return eval('() => { return `' + template + '`}')();
            }, internal, this);
        }
    }]);

    return Compiler;
}();

var HashStrategy = exports.HashStrategy = function () {
    function HashStrategy() {
        _classCallCheck(this, HashStrategy);
    }

    _createClass(HashStrategy, [{
        key: "getCurrentLocation",
        value: function getCurrentLocation() {
            var url = location.hash || "/";
            url = url.replace("#", "");
            return url;
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

        // init/clear instances storage:
        window.instances = {};

        // init/clear subscriptions:
        window.subscriptions = {};

        window.subscribe = function (eventName, cb, origin) {
            if (!window.subscriptions[eventName]) window.subscriptions[eventName] = [];
            window.subscriptions[eventName].push([cb, origin]);
        };

        window.broadcast = function (eventName, message, origin) {
            if (window.subscriptions[eventName]) {
                window.subscriptions[eventName].forEach(function (data) {
                    var cb = data[0];
                    var required_origin = data[1];
                    if (!required_origin || required_origin.uid() == origin.uid()) cb(message);
                });
            }
        };

        // get routing strategy:
        var strategy = window.router.strategy || new HashStrategy();

        var load = function load(url) {

            // get loadTarget:
            url = url || strategy.getCurrentLocation();
            var loadTarget = window.router[url];

            if (loadTarget) {

                // compile baseWidget:
                document.body.innerHTML = new Compiler().compile(loadTarget, window.config).render();

                // initialize all <widget>'s:
                var widgets = [].slice.call(document.getElementsByTagName("widget"));
                widgets.forEach(function (widget) {
                    var api = window.instances[widget.getAttribute("id")];
                    api.createListeners();
                });
            }
        };

        document.body.addEventListener("click", function (event) {
            if (event.target.tagName.toLowerCase() == "a") {
                strategy.onClick(event);
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
