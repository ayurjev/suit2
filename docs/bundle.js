(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Variables = function (_Component) {
    _inherits(Variables, _Component);

    function Variables() {
        _classCallCheck(this, Variables);

        return _possibleConstructorReturn(this, (Variables.__proto__ || Object.getPrototypeOf(Variables)).apply(this, arguments));
    }

    _createClass(Variables, [{
        key: "template",
        value: function template() {
            return "VARS!";
        }
    }, {
        key: "init",
        value: function init() {
            console.dir("code instantiated");
        }
    }, {
        key: "createListeners",
        value: function createListeners() {
            alert("createListeners");
            this.initCode();
        }
    }, {
        key: "initCode",
        value: function initCode() {
            console.dir("code inited");
        }
    }]);

    return Variables;
}(_Component2.Component);

exports.default = Variables;

},{"../../src/classes/Component":13}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AboutMenu = function (_Component) {
    _inherits(AboutMenu, _Component);

    function AboutMenu() {
        _classCallCheck(this, AboutMenu);

        return _possibleConstructorReturn(this, (AboutMenu.__proto__ || Object.getPrototypeOf(AboutMenu)).apply(this, arguments));
    }

    _createClass(AboutMenu, [{
        key: "template",
        value: function template() {
            return "\n            <nav class=\"verticalMenu\">\n                <ul>\n                    <li><a class=\"active\" href=\"/about/motivation\">Motivation</a></li>\n                    <li><a href=\"/about/features\">Main features & ideas</a></li>\n                </ul>\n            </nav>\n        ";
        }
    }]);

    return AboutMenu;
}(_Component2.Component);

exports.default = AboutMenu;

},{"../../src/classes/Component":13}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DocsMenu = function (_Component) {
    _inherits(DocsMenu, _Component);

    function DocsMenu() {
        _classCallCheck(this, DocsMenu);

        return _possibleConstructorReturn(this, (DocsMenu.__proto__ || Object.getPrototypeOf(DocsMenu)).apply(this, arguments));
    }

    _createClass(DocsMenu, [{
        key: "template",
        value: function template() {
            return "\n            <nav class=\"verticalMenu\">\n                <ul>\n                    <li><a href=\"/docs/variables\">Variables</a>\n                </ul>\n            </nav>\n        ";
        }
    }]);

    return DocsMenu;
}(_Component2.Component);

exports.default = DocsMenu;

},{"../../src/classes/Component":13}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopMenu = function (_Component) {
    _inherits(TopMenu, _Component);

    function TopMenu() {
        _classCallCheck(this, TopMenu);

        return _possibleConstructorReturn(this, (TopMenu.__proto__ || Object.getPrototypeOf(TopMenu)).apply(this, arguments));
    }

    _createClass(TopMenu, [{
        key: "template",
        value: function template() {
            return "\n            <nav class=\"topMenu\">\n                <ul>\n                    <li><a class=\"active\" href=\"/about/\">About</a></li>\n                    <li><a href=\"/docs/\">Docs</a></li>\n                    <li><a href=\"/contact/\">Contact</a></li>\n                </ul>\n            </nav>\n        ";
        }
    }]);

    return TopMenu;
}(_Component2.Component);

exports.default = TopMenu;

},{"../../src/classes/Component":13}],5:[function(require,module,exports){
"use strict";

var _Application = require("../src/classes/Application");

new _Application.Application({
    "/": require("./pages/Title"),
    "/about/": require("./pages/Title"),
    "/about/motivation": require("./pages/About/Motivation"),
    "/about/features": require("./pages/About/Features"),
    "/contact/": require("./pages/Contact"),
    "/docs/": require("./pages/Docs"),
    "/docs/<subject>/": require("./pages/Docs")
}, {
    "baseDir": "/suit2"
}, {
    "Bootstrap": require("./layouts/Bootstrap"),
    "TopMenu": require("./blocks/TopMenu"),
    "AboutMenu": require("./blocks/AboutMenu"),
    "DocsMenu": require("./blocks/DocsMenu")
});

},{"../src/classes/Application":12,"./blocks/AboutMenu":2,"./blocks/DocsMenu":3,"./blocks/TopMenu":4,"./layouts/Bootstrap":6,"./pages/About/Features":7,"./pages/About/Motivation":8,"./pages/Contact":9,"./pages/Docs":10,"./pages/Title":11}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bootstrap = function (_Component) {
	_inherits(Bootstrap, _Component);

	function Bootstrap() {
		_classCallCheck(this, Bootstrap);

		return _possibleConstructorReturn(this, (Bootstrap.__proto__ || Object.getPrototypeOf(Bootstrap)).apply(this, arguments));
	}

	_createClass(Bootstrap, [{
		key: "template",
		value: function template() {
			return "\n\t\t\t<div class=\"wrapper\">\n\t\t\t\t<header>\n\t\t\t\t\t<h1><a href=\"/\">Suit</a></h1>\n\t\t\t\t\t{include:TopMenu}\n\t\t\t\t\t{$submenu || \"\"}\n\t\t\t\t</header>\n\t\t\t\t<section>\n\t\t            <h1 class=\"post-title\">{$caption}</h1>\n\t\t\t\t\t<br />\n\t\t            {$content || DEFAULT-CONTENT}\n\t\t        </section>\n\t\t    </div>\n\t\t";
		}
	}]);

	return Bootstrap;
}(_Component2.Component);

exports.default = Bootstrap;

},{"../../src/classes/Component":13}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FeaturesPage = function (_Component) {
    _inherits(FeaturesPage, _Component);

    function FeaturesPage() {
        _classCallCheck(this, FeaturesPage);

        return _possibleConstructorReturn(this, (FeaturesPage.__proto__ || Object.getPrototypeOf(FeaturesPage)).apply(this, arguments));
    }

    _createClass(FeaturesPage, [{
        key: "template",
        value: function template() {
            return "\n        {rebuild:Bootstrap with\n            {submenu: include:AboutMenu},\n            {caption: Features & Ideas\"},\n            {content:\n                <ul>\n                    <li>ES6 compatible</li>\n                    <li>Freaking lightweight and compact runtime (24kb raw lib)</li>\n                    <li>No runtime dependencies (dev-dependencies only)</li>\n                    <li>Component-oriented approach (incapsulation)</li>\n                    <li>Event-driven approach (pub/sub model)</li>\n                    <li>Single-state (app wide) or Local-state (component wide)</li>\n                    <li>Built-in and very simple router</li>\n                    <li>Page-based routing system</li>\n                    <li>Great support for static sites (file:// protocol supported)</li>\n                    <li>No auto-refreshing of the DOM (manual, on purpose)</li>\n                    <li>State mutations allowed</li>\n                    <li>No requirements for the project structure</li>\n                    <li>Any approach for the CSS</li>\n                    <li>No props (child component inherits parent's state)</li>\n\n                    <li class='future'>Automated assignment of '.active' for the 'a' tags (optional)</li>\n                    <li class='future'>Built-in tool for ajax-requests (optional)\n                    <li class='future'>Server-side rendering support (optional)</li>\n                    <li class='future'>Bundle.js sharding (optional)</li>\n                    <li class='future'>Component-only styles (optional)</li>\n                </ul>\n            }\n        }";
        }
    }]);

    return FeaturesPage;
}(_Component2.Component);

exports.default = FeaturesPage;
;

},{"../../../src/classes/Component":13}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MotivationPage = function (_Component) {
    _inherits(MotivationPage, _Component);

    function MotivationPage() {
        _classCallCheck(this, MotivationPage);

        return _possibleConstructorReturn(this, (MotivationPage.__proto__ || Object.getPrototypeOf(MotivationPage)).apply(this, arguments));
    }

    _createClass(MotivationPage, [{
        key: "template",
        value: function template() {
            return "\n        {rebuild:Bootstrap with\n            {submenu: include:AboutMenu},\n            {caption: Why?},\n            {content:\n                <p>\n                    I have worked a lot with different kind of frameworks and libraries in order to find a way to build modern web-applications with ease and comfort... Even though there is a huge amount of options - I failed to find the right one.\n                </p>\n\n                <p>\n                    Yes, I've built plenty of web-applications using all of those technologies that I tried on my way, but I didn't found a combination of flexibility and straightforwardness I was looking for...\n                </p>\n\n                <p>\n                    I needed a tool, that would be as powerfull as \"react+redux+some kind of router\" (but not that sophisticated) or as powerfull as angular (but not that verbose and opinionated).\n                </p>\n\n                <p>\n                    So, I decided to build it myself. Why not? At least it should've been fun and much more interesting than my regular work at the time...\n                </p>\n\n                <p>\n                    I decided to take everything that seemed to me as a good idea from other tools I learned, but get rid of any kind of complexity or syntax uglyness...\n                </p>\n\n                <p>\n                    I know, that \"Suit\" may lack a lot of things because of absence of that complexity, but this way it gained a great benefit - simplicity.\n                </p>\n\n                <p>\n                    P.S. This particular website is built with \"Suit\" while \"Suit\" was under development and testing, this was my approach to try it myself before demonstrating it to other people.\n                </p>\n            }\n        }";
        }
    }]);

    return MotivationPage;
}(_Component2.Component);

exports.default = MotivationPage;

},{"../../../src/classes/Component":13}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContactPage = function (_Component) {
    _inherits(ContactPage, _Component);

    function ContactPage() {
        _classCallCheck(this, ContactPage);

        return _possibleConstructorReturn(this, (ContactPage.__proto__ || Object.getPrototypeOf(ContactPage)).apply(this, arguments));
    }

    _createClass(ContactPage, [{
        key: "template",
        value: function template() {
            return "{\n            rebuild:Bootstrap with\n            {caption: Contact me},\n            {content:\n                <p>\n                    Github: <a href=\"https://github.com/ayurjev/suit2\">https://github.com/ayurjev/suit2</a>\n                </p>\n                <p>\n                    Contact me: <a href=\"mailto:$email\">$email</a>\n                </p>\n            }\n        }";
        }
    }, {
        key: "init",
        value: function init() {
            this.state.email = "andrey.yurjev@gmail.com";
        }
    }]);

    return ContactPage;
}(_Component2.Component);

exports.default = ContactPage;

},{"../../src/classes/Component":13}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DocsPage = function (_Component) {
    _inherits(DocsPage, _Component);

    function DocsPage() {
        _classCallCheck(this, DocsPage);

        return _possibleConstructorReturn(this, (DocsPage.__proto__ || Object.getPrototypeOf(DocsPage)).apply(this, arguments));
    }

    _createClass(DocsPage, [{
        key: "template",
        value: function template() {
            return "{\n            rebuild:Bootstrap with {\n                \"submenu\": \"include:DocsMenu\",\n                \"caption\": \"Documentation\"\n            }\n        }";
        }
    }, {
        key: "init",
        value: function init() {
            this.variables = this.component(require("../articles/Variables"));

            switch (this.state.request.subject) {
                case "variables":
                    this.state.content = this.variables.render();
                    break;
                default:
                    this.state.content = "<p>Under development</p>";
            }
        }
    }]);

    return DocsPage;
}(_Component2.Component);

exports.default = DocsPage;

},{"../../src/classes/Component":13,"../articles/Variables":1}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("../../src/classes/Component");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TitlePage = function (_Component) {
    _inherits(TitlePage, _Component);

    function TitlePage() {
        _classCallCheck(this, TitlePage);

        return _possibleConstructorReturn(this, (TitlePage.__proto__ || Object.getPrototypeOf(TitlePage)).apply(this, arguments));
    }

    _createClass(TitlePage, [{
        key: "template",
        value: function template() {
            return "{\n            rebuild:Bootstrap with {\n                \"submenu\": \"include:AboutMenu\"\n            }\n        }";
        }
    }, {
        key: "init",
        value: function init() {
            this.state.caption = "Freaking-simple microframework for building modern web-applications...";
            this.state.content = "\n            <p>\n                Designed to be be as powerfull as \"react+redux+some kind of router\" (but not that sophisticated) or as powerfull as angular (but not that verbose and opinionated).\n            </p>\n        ";
        }
    }]);

    return TitlePage;
}(_Component2.Component);

exports.default = TitlePage;

},{"../../src/classes/Component":13}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Routing = require("./Routing");

var _Component = require("./Component");

var _Exceptions = require("./Exceptions");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require("./Helpers");
require("./ComponentRuntime");

/**
 *  Main Appilcation class
 */

var Application = function () {
    function Application(router, config, includes) {
        _classCallCheck(this, Application);

        this.router = router || {};
        this.config = config || {};
        this.instances = {};
        this.subscriptions = {};
        this.uids_cache = {};
        this.router.strategy = this.router.strategy || new _Routing.StrategyFactory(this).getStrategy();
        this.controllerFactory = new _Routing.ControllerFactory(this);
        this.global_includes = includes || {};
        this.initDomListeners();
    }

    /**
     *  Initializing Dom Event Listeners
     */


    _createClass(Application, [{
        key: "initDomListeners",
        value: function initDomListeners() {
            var _this = this;

            // domReady:
            var domReadyCallback = function domReadyCallback() {

                document.body.addEventListener("click", function (event) {
                    if (event.target.tagName.toLowerCase() == "a") {
                        _this.router.strategy.onClick(event, function () {
                            _this.load();
                        });
                        event.preventDefault();
                    }
                });

                window.addEventListener('popstate', function (e) {
                    _this.load();
                }, false);
                _this.load();
            };

            try {
                /**
                 * findParent for dom-elements
                 */
                Element.prototype.findParent = function (css) {
                    var parent = this.parentElement;
                    while (parent) {
                        if (parent.matches(css)) return parent;else parent = parent.parentElement;
                    }
                    return null;
                };

                window.app = this;
                document.readyState === "interactive" || document.readyState === "complete" ? domReadyCallback() : document.addEventListener("DOMContentLoaded", domReadyCallback);
            } catch (e) {}
        }

        /**
         *  Deep copying for objects
         */

    }, {
        key: "deepClone",
        value: function deepClone(source) {
            if (this.config.state == "shared") return source;
            var destination = {};
            for (var property in source) {
                if (_typeof(source[property]) === "object" && source[property] !== null) {
                    destination[property] = this.deepClone(source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        }
    }, {
        key: "chunks",


        /**
         *  Reading/compiling template using stack for correct splitting template into chunks
         */
        value: function chunks(template, compile_cb) {
            var repl = {};

            var start = template.indexOf("{");

            while (start > -1) {
                var stack = 1;
                var p = start;

                while (stack > 0) {
                    p++;
                    if (template[p]) {
                        if (template[p] == "{") stack++;
                        if (template[p] == "}") stack--;
                    } else {
                        throw new _Exceptions.UnbalancedBracketsError("in template: " + template.slice(start, p));
                    }
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

        /**
         * Generating UID for widgets (with cache)
         */

    }, {
        key: "generateUID",
        value: function generateUID(t) {
            // TODO: it is not good idea to use the whole temlate as a key...
            // We should use a hash, but there is no md5 function in raw js
            var obj = t.default || t;
            if (this.uids_cache[obj.toString()]) return this.uids_cache[obj.toString()];else {
                var p = function p() {
                    return ("000" + (Math.random() * 46656 | 0).toString(36)).slice(-3);
                };
                var uid = p() + p();
                this.uids_cache[obj.toString()] = uid;
                return uid;
            }
        }

        /**
         *  Compiling js-module into Component-instance
         */

    }, {
        key: "component",
        value: function component(t, state, includes) {
            var uid = this.generateUID(t);
            var prev_state = this.instances[uid] ? this.instances[uid].state : {};

            var component = new (t.default || t)(uid, Object.assign(prev_state || {}, state || {}), Object.assign({}, includes || {}), this);

            this.instances[uid] = component;
            return this.instances[uid];
        }

        /**
         *  Loading current controller (returned by ControllerFactory according to the app's routing)
         */

    }, {
        key: "load",
        value: function load() {
            this.clear();
            this.loadTarget(this.getLoadTarget());
        }

        /**
         *  Loading given controller into DOM
         */

    }, {
        key: "loadTarget",
        value: function loadTarget(_loadTarget) {
            var _this2 = this;

            if (_loadTarget) {
                document.body.innerHTML = _loadTarget.render();

                var components = [].slice.call(document.getElementsByTagName("component"));

                components.forEach(function (component) {
                    _this2.instances[component.getAttribute("id")].createListeners();
                });

                /* Make links active or unactive automatically */
                var links = [].slice.call(document.getElementsByTagName("a"));
                var currentLocation = this.router.strategy.getCurrentLocation().trimAll("/").split("/");

                links.forEach(function (a) {
                    var href = a.getAttribute("href").trimAll("/").split("/");
                    var match = true;
                    for (var i = 0; i < href.length; i++) {
                        if (href[i] != currentLocation[i]) {
                            match = false;
                            break;
                        }
                    };

                    if (match) {
                        a.classList.add("active");
                    } else {
                        a.classList.remove("active");
                    }
                });
            }
        }

        /**
         * Choosing controller from router based on current URL
         */

    }, {
        key: "getLoadTarget",
        value: function getLoadTarget(url) {
            return this.controllerFactory.get(url || this.router.strategy.getCurrentLocation());
        }

        /**
         * Clearing Application state (attributes that can be regenerated during page load)
         */

    }, {
        key: "clear",
        value: function clear() {
            this.instances = {};
            this.subscriptions = {};
        }

        /**
         *  Adding new subscription
         */

    }, {
        key: "subscribe",
        value: function subscribe(eventName, cb, origin) {
            if (!this.subscriptions[eventName]) this.subscriptions[eventName] = [];
            this.subscriptions[eventName].push([cb, origin]);
        }
    }, {
        key: "broadcast",


        /**
         *  Firing new event to all subscribers
         */
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

    return Application;
}();

exports.Application = Application;

},{"./Component":13,"./ComponentRuntime":14,"./Exceptions":15,"./Helpers":17,"./Routing":18}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Component
 */
var Component = exports.Component = function () {
    function Component(uid, state, includes, app) {
        _classCallCheck(this, Component);

        this.app = app;
        this.uid = uid;

        this.api = {};
        this.state = state || {};
        this.includes = includes || {};

        this.compileTemplate();
        this.init();
    }

    _createClass(Component, [{
        key: 'compileTemplate',
        value: function compileTemplate() {
            var template;
            try {
                if (window) {
                    template = '<component id="' + this.uid + '">' + this.template() + '</component>';
                }
            } catch (ReferenceError) {
                template = this.template();
            }

            template = template.replace(/\s\s+/mig, " ").trim();

            template = this.app.chunks(template, function (to_compile) {
                return to_compile.replace(/{((.|\n)+)}/ig, function (m, s) {
                    return "`+this.exp(`" + s + "`)+`";
                });
            });
            this.template = function () {
                return eval('() => { return `' + template + '`}')().replace(/\s\s+/mig, " ");
            };
        }
    }, {
        key: 'setState',
        value: function setState(state) {
            this.state = state;
        }
    }, {
        key: 'component',
        value: function component(t, additional_scope, iternum) {
            if (t instanceof Component) {
                t.setState(Object.assign({}, t.state, this.app.deepClone(this.state), additional_scope || {}));
                return t;
            }
            return this.app.component(t, Object.assign({}, this.app.deepClone(this.state), additional_scope || {}));
        }
    }, {
        key: 'tag',
        value: function tag() {
            try {
                return document.getElementById(this.uid);
            } catch (e) {}
        }
    }, {
        key: 'subscribe',
        value: function subscribe(eName, cb, origin) {
            window.app.subscribe(eName, cb, origin);
        }
    }, {
        key: 'broadcast',
        value: function broadcast(eName, message) {
            window.app.broadcast(eName, message, this.api);
        }
    }, {
        key: 'createListeners',
        value: function createListeners() {}
    }, {
        key: 'init',
        value: function init() {}
    }, {
        key: 'template',
        value: function template() {}

        /**
         * Refreshing component in DOM
         */

    }, {
        key: 'refresh',
        value: function refresh() {
            try {
                var tag = this.tag();
                var target = tag;
                if (window.app.config.refresh_up && window.app.config.state == "shared") {
                    do {
                        target = tag;tag = tag.findParent("component");
                    } while (tag);
                }

                target.outerHTML = window.app.instances[target.getAttribute("id")].render();
            } catch (e) {}
        }

        /**
         * Getting Public Api of the Widget
         */

    }, {
        key: 'getApi',
        value: function getApi() {
            var _this = this;

            return Object.assign({}, { uid: function uid() {
                    return _this.uid;
                }, init: function init() {
                    _this.init();
                }, createListeners: function createListeners() {
                    _this.createListeners();
                } }, this.api);
        }

        /**
         *  Rendering Widget into string
         */

    }, {
        key: 'render',
        value: function render(state) {
            this.state = state || this.state;
            return this.template();
        }
    }]);

    return Component;
}();

},{}],14:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Filters = require("./Filters");

var _Component = require("./Component");

var _Exceptions = require("./Exceptions");

/**
 *  Executing template engine expression - {}
 */
_Component.Component.prototype.exp = function (source, additional_scope, iternum) {
    var _this = this;

    try {
        source = source.trim();
    } catch (TypeError) {
        return "";
    }

    if (/\((.+?)\)/mig.test(source)) {
        source = source.replace(/\((.+?)\)/mig, function (m, s) {
            return "(" + _this.exp(s, additional_scope, iternum) + ")";
        });
    }

    if (/^for (.+?) in (.+?)\s(.+?)$/mig.test(source)) return this.list(source, additional_scope, iternum);
    if (/^include:(.+?)$/mig.test(source)) return this.include_with(source, additional_scope, iternum);
    if (/^rebuild:(.+?)$/mig.test(source)) return this.rebuild(source, additional_scope, iternum);
    if (/(.+?)\s\?\s(.+?)/mig.test(source)) return this.ternary(source, additional_scope, iternum);

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
};

/**
 * Executing call for a variable
 */
_Component.Component.prototype.var = function (source, additional_scope, iternum) {
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
};

/**
 * Extracting variable's value
 */
_Component.Component.prototype.extract = function (path, additional_scope, iternum) {
    var value = null;
    var filter = null;
    var data = Object.assign({}, this.state, additional_scope);

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

    //value = this.escape(value);

    if (filter) {
        var _filter$match = filter.match(/(?:.+?)\((.*?)\)$/),
            _filter$match2 = _slicedToArray(_filter$match, 2),
            params = _filter$match2[1];

        if (params.length && params.indexOf('"') != 0 && params.indexOf("'") != 0 && params.indexOf('[') != 0 && params.indexOf('{') != 0) {
            filter = filter.replace(params, '"' + params + '"');
        }
        var f = new _Filters.Filters(value);
        value = eval("f." + filter);
    }
    return value;
};

/**
 *  Escaping special characters
 */
_Component.Component.prototype.escape = function (obj) {
    if (typeof obj == "string") {
        var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
        return obj.replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
    return obj;
};

/**
 * Evaluating basic js logic operations
 */
_Component.Component.prototype.cmp2 = function (v1, v2, op, additional_scope, iternum) {
    v1 = this.exp(v1, additional_scope, iternum);
    v2 = this.exp(v2, additional_scope, iternum);
    try {
        return eval(v1 + op + v2);
    } catch (ReferenceError) {
        try {
            return eval(v1 + op + '`' + v2 + '`');
        } catch (ReferenceError) {
            try {
                return eval('`' + v1 + '`' + op + v2);
            } catch (ReferenceError) {
                return eval('`' + v1 + '`' + op + '`' + v2 + '`');
            }
        }
    }
};

/**
 *  Evaluating ternanry logic
 */
_Component.Component.prototype.ternary = function (var_name, additional_scope, iternum) {
    var_name = var_name.replace(":", "?");

    var _var_name$split = var_name.split("?"),
        _var_name$split2 = _slicedToArray(_var_name$split, 3),
        path = _var_name$split2[0],
        positive = _var_name$split2[1],
        negative = _var_name$split2[2];

    return this.exp(path, additional_scope, iternum) ? this.exp(positive, additional_scope, iternum) : this.exp(negative, additional_scope, iternum);
};

/**
 * Evaluating iterations/lists
 */
_Component.Component.prototype.list = function (expression, additional_scope, iternum) {
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

    var itertemplate_compiled = this.app.chunks(itertemplate, function (to_compile) {
        return to_compile.replace(/{((.|\n)+)}/ig, function (m, s) {
            return "` + ((component, scope, iternum) => { return component.exp(`" + s + "`, scope, iternum); })(component, scope, iternum) + `";
        });
    });

    itertemplate_compiled = eval("((component, scope, iternum) => { return `" + itertemplate_compiled + "`; })");

    var i = 0;
    iterable.forEach(function (itervalue, num) {
        var local_scope = additional_scope || {};
        local_scope[iterkey] = itervalue;
        out += itertemplate_compiled(that, local_scope, function () {
            i++;return i;
        });
    });

    return out;
};

/**
 * Including other components
 */
_Component.Component.prototype.include = function (expression, additional_scope, iternum) {
    expression = expression.replace("include:", "").trim();

    if (expression.indexOf("$") == 0) expression = this.extract(expression);

    var t = this.includes[expression] || this.app.global_includes[expression];

    if (!t) {
        throw new _Exceptions.ComponentNotFoundError("Component '" + expression + "' not found");
    };

    var component = this.component(t, additional_scope, iternum);

    return component.render();
};

/**
 * Building scope from string and iteration data
 */
_Component.Component.prototype.scope = function (data, additional_scope, iternum) {
    if (data.indexOf("[") == 0 || data.indexOf("{") == 0) {
        data = JSON.parse(this.var(data, additional_scope, iternum));
    } else data = this.extract(data);
    return Object.assign({}, this.app.deepClone(this.state), data);
};

/**
 * Including components with additional data, passed as substate
 */
_Component.Component.prototype.include_with = function (expression, additional_scope, iternum) {
    if (expression.indexOf("with") > -1) {
        var _expression$match3 = expression.match(/include:(.+?) with\s(.+?)$/),
            _expression$match4 = _slicedToArray(_expression$match3, 3),
            template = _expression$match4[1],
            data = _expression$match4[2];

        additional_scope = this.scope(data, additional_scope, iternum);
        expression = template;
    }
    return this.include(expression, additional_scope, iternum);
};

/**
 *  Generating new component using other component as a template
 */
_Component.Component.prototype.rebuild = function (expression, additional_scope, iternum) {
    var _expression$match5 = expression.match(/rebuild:(.+?) with\s(.+?)$/),
        _expression$match6 = _slicedToArray(_expression$match5, 3),
        template = _expression$match6[1],
        data = _expression$match6[2];

    try {
        data = JSON.parse(data);
    } catch (e) {
        var parsedData = {};
        data.replace(/{(.+?):(.+?)}/ig, function (match, key, content) {
            parsedData[key] = content;
        });
        data = parsedData;
    }

    for (var item in data) {
        var scope = Object.assign({}, this.app.deepClone(this.state), additional_scope);
        data[item] = this.exp(data[item]);
    }
    data = JSON.stringify(data);

    return this.include(template, this.scope(data, additional_scope, iternum), iternum);
};

},{"./Component":13,"./Exceptions":15,"./Filters":16}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnbalancedBracketsError = UnbalancedBracketsError;
exports.ComponentNotFoundError = ComponentNotFoundError;
function UnbalancedBracketsError(message) {
  this.message = message || "";
}
UnbalancedBracketsError.prototype = new Error();

function ComponentNotFoundError(message) {
  this.message = message || "";
}
ComponentNotFoundError.prototype = new Error();

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Filters for variables
 */
var Filters = exports.Filters = function () {
    function Filters(value) {
        _classCallCheck(this, Filters);

        this.value = value;
    }

    /**
     * Length of the object
     */


    _createClass(Filters, [{
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

        /**
         * Formatting dates/times
         */

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

        /**
         * Searching variable in some haystack
         */

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


        /**
         *  Selecting correct form of the word based on given number
         */
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


        /**
         * Unquoting special characters
         */
        value: function html() {
            return decodeURI(this.value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x2F;/g, "/"));
        }

        // Other filters:

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
            return new Filters(needle).in(this.value);
        }
    }]);

    return Filters;
}();

},{}],17:[function(require,module,exports){
'use strict';

/**
 * replaceAll for strings
 */
String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

/**
 * trimAll for strings
 */
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

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Factory for selecting controllers
 */
var ControllerFactory = exports.ControllerFactory = function () {
    function ControllerFactory(app) {
        _classCallCheck(this, ControllerFactory);

        this.app = app;
        this.router = {};
        for (var routePattern in app.router) {
            this.router[routePattern.trimAll("/")] = app.router[routePattern];
        };
    }

    /**
     * Extracting parameters from url's
     */


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

        /**
         * Selecting controller based on given URL
         */

    }, {
        key: "get",
        value: function get(url) {
            url = url.trimAll("/");
            // Fast Access Controller (full match)
            var fast_acs_controller = this.router[url];
            if (fast_acs_controller != null) return this.app.component(fast_acs_controller, Object.assign({}, this.app.config, { "request": {} }));

            // Searching for best option:
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
                        // Match found with minimum amount of placeholders - no need to keep looking...
                        if (phCount == 1) break;
                    }
                }
            };
            if (best_controller) {
                return this.app.component(best_controller, Object.assign({}, this.app.config, { "request": best_controller_request }));
            }
            throw new Error("404 NotFound");
        }

        /**
         * Checking if url matches given route pattern
         */

    }, {
        key: "isMatch",
        value: function isMatch(url, routePattern) {
            routePattern = "^" + routePattern + "$";
            return new RegExp(routePattern.trimAll("/").replaceAll("(<(.+?)>)", "(.+?)")).test(url.trimAll("/"));
        }
    }]);

    return ControllerFactory;
}();

var StrategyFactory = exports.StrategyFactory = function () {
    function StrategyFactory(app) {
        _classCallCheck(this, StrategyFactory);

        this.app = app;
    }

    _createClass(StrategyFactory, [{
        key: "getStrategy",
        value: function getStrategy() {
            try {
                if (location.protocol == "file:") return new HashStrategy(this.app);
                if (location.protocol == "http:") return new PathStrategy(this.app);
                if (location.protocol == "https:") return new PathStrategy(this.app);
            } catch (Error) {}
            return new HashStrategy(this.app);
        }
    }]);

    return StrategyFactory;
}();

/**
 * Strategy for navigation based on location.hash
 */


var HashStrategy = exports.HashStrategy = function () {
    function HashStrategy(app) {
        _classCallCheck(this, HashStrategy);

        this.app = app;
    }

    _createClass(HashStrategy, [{
        key: "getCurrentLocation",
        value: function getCurrentLocation() {
            return (location.hash || "/").replace("#", "");
        }
    }, {
        key: "onClick",
        value: function onClick(event, cb, app) {
            var href = event.target.href;
            href = href.replace("file://", "");
            var prev = location.hash;
            location.hash = href;
        }
    }]);

    return HashStrategy;
}();

/**
 * Strategy for navigation based on location.href
 */


var PathStrategy = exports.PathStrategy = function () {
    function PathStrategy(app) {
        _classCallCheck(this, PathStrategy);

        this.app = app;
    }

    _createClass(PathStrategy, [{
        key: "getCurrentLocation",
        value: function getCurrentLocation() {
            return (location.pathname || "/").replace(this.app.config["baseDir"] || "", "");
        }
    }, {
        key: "onClick",
        value: function onClick(event, cb, app) {
            var href = (this.app.config["baseDir"] || "") + event.target.pathname;
            history.pushState({}, '', href);
            try {
                cb();
            } catch (Error) {
                history.back();
                cb();
            }
        }
    }]);

    return PathStrategy;
}();

},{}]},{},[5]);
