

import {StrategyFactory, ControllerFactory} from "./Routing";
import {Component} from "./Component";
import {ComponentNotFoundError,UnbalancedBracketsError} from "./Exceptions";
require("./Helpers");
require("./ComponentRuntime");


/**
 *  Main Appilcation class
 */
export class Application {

    constructor(router, config, includes) {
        this.router = router || {};
        this.config = config || {};
        this.instances = {};
        this.subscriptions = {};
        this.uids_cache = {};
        this.router.strategy = this.router.strategy || new StrategyFactory(this).getStrategy();
        this.controllerFactory = new ControllerFactory(this);
        this.global_includes = includes || {};
        this.initDomListeners();
    }

    /**
     *  Initializing Dom Event Listeners
     */
    initDomListeners() {
            // domReady:
            let domReadyCallback = () => {

                document.body.addEventListener("click", (event) => {
                    if (event.target.tagName.toLowerCase() == "a") {
                        this.router.strategy.onClick(event, () => { this.load(); });
                        event.preventDefault();
                    }
                });

                window.addEventListener('popstate', (e) => { this.load() }, false);
                this.load();
            };

            try {
                /**
                 * findParent for dom-elements
                 */
                    Element.prototype.findParent = function(css) {
                    var parent = this.parentElement;
                    while (parent) {
                        if (parent.matches(css)) return parent;
                        else parent = parent.parentElement;
                    }
                    return null;
                };

                window.app = this;
                document.readyState === "interactive" || document.readyState === "complete"
                ? domReadyCallback() : document.addEventListener("DOMContentLoaded", domReadyCallback);
            } catch (e) { }
    }

    /**
     *  Deep copying for objects
     */
    deepClone(source) {
        if (this.config.state == "shared") return source;
        var destination = {};
        for (var property in source) {
            if (typeof source[property] === "object" && source[property] !== null) {
                destination[property] = this.deepClone(source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    };

    /**
     *  Reading/compiling template using stack for correct splitting template into chunks
     */
    chunks(template, compile_cb) {
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
                        throw new UnbalancedBracketsError("in template: " + template.slice(start, p));
                    }
                }
                var to_compile = template.slice(start, p + 1);
                var compiled = compile_cb(to_compile);

                var next_start = template.slice(p + 1, template.length).indexOf("{")
                if (next_start > -1) start = p + next_start + 1;
                else start = -1;

                if (!repl[to_compile]) repl[to_compile] = [compiled];
                else repl[to_compile].push(compiled);
            }

            for (to_compile in repl) {
                for (var i in repl[to_compile]) {
                    template = template.replace(to_compile, repl[to_compile][i]);
                }
            }

            return template;
    }

    /**
     *  Compiling js-module into Component-instance
     */
    createComponent(t, state, includes, parentComponent) {
        var uid = this.generateUID(t, parentComponent);
        var prev_state = this.instances[uid] ? this.instances[uid].state : {};
        var component = new (t.default || t)(
            uid,
            Object.assign(prev_state || {}, state || {}),
            Object.assign({}, includes || {}),
            this
        );
        this.instances[uid] = component;
        component.render();
        return this.instances[uid];
    }

    /**
     * Generating UID for widgets (with cache)
     */
    generateUID(t, parentComponent) {
        var obj = t.default || t;
        return (parentComponent ? parentComponent.uid : "rootUID") + "." + (new obj).constructor.name + "[" + (parentComponent ? parentComponent.components(obj).length : 0) + "]";
    }

    /**
     *  Loading current controller (returned by ControllerFactory according to the app's routing)
     */
    load() {
        this.clear();
        this.loadTarget(this.getLoadTarget());
    }

    /**
     *  Loading given controller into DOM
     */
    loadTarget(loadTarget) {
        if (loadTarget) {
            document.body.innerHTML = loadTarget.render();

            var components = [].slice.call(document.getElementsByTagName("component"));

            components.forEach((component) => {
                this.instances[component.getAttribute("id")].createListeners();
            });

            /* Make links active or unactive automatically */
            var links = [].slice.call(document.getElementsByTagName("a"));
            var currentLocation = this.router.strategy.getCurrentLocation().trimAll("/").split("/");

            links.forEach((a) => {
                var href = a.getAttribute("href").trimAll("/").split("/");
                var match = true;
                for (var i = 0; i < href.length; i++) {
                    if (href[i] != currentLocation[i]) {
                        match = false;
                        break;
                    }
                };

                if (match) { a.classList.add("active"); }
                else { a.classList.remove("active"); }
            });
        }
    }

    /**
     * Choosing controller from router based on current URL
     */
    getLoadTarget(url) {
        return this.controllerFactory.get(url || this.router.strategy.getCurrentLocation())
    }

    /**
     * Clearing Application state (attributes that can be regenerated during page load)
     */
    clear() {
        this.instances = {};
        this.subscriptions = {};
    }

    /**
     *  Adding new subscription
     */
    subscribe(eventName, cb, origin) {
        if (!this.subscriptions[eventName]) this.subscriptions[eventName] = [];
        this.subscriptions[eventName].push([cb, origin]);
    };

    /**
     *  Firing new event to all subscribers
     */
    broadcast(eventName, message, origin) {
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName].forEach((data) => {
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
}
