

/**
 * Factory for selecting controllers
 */
export class ControllerFactory {

    constructor(app) {
        this.app = app
        this.router = {};
        for (var routePattern in app.router) { this.router[routePattern.trimAll("/")] = app.router[routePattern]; };
    }

    /**
     * Extracting parameters from url's
     */
    extractParameters(url, routePattern) {
        var result = {};
        let names = routePattern.trimAll("/").split("/");
        let values = url.trimAll("/").split("/");

        for (var i=0; i<names.length; i++) {
            var name = names[i];
            if ((new RegExp("<.+?>")).test(name)) {
                var trimmedName = name.replaceAll("<", "").replaceAll(">", "");
                result[trimmedName] = values[i];
            }
        }
        return result;
    }

    /**
     * Selecting controller based on given URL
     */
    get(url) {
        url = url.trimAll("/");
        // Fast Access Controller (full match)
        let fast_acs_controller = this.router[url];
        if (fast_acs_controller != null)
        return this.app.component(fast_acs_controller, Object.assign({}, this.app.config, {"request": {}}));

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
            return this.app.component(best_controller, Object.assign({}, this.app.config, {"request": best_controller_request}));
        }
        throw new Error("404 NotFound")
    }

    /**
     * Checking if url matches given route pattern
     */
    isMatch(url, routePattern) {
        routePattern = "^" + routePattern + "$";
        return (new RegExp(routePattern.trimAll("/").replaceAll("(<(.+?)>)", "(.+?)"))).test(url.trimAll("/"));
    }
}

export class StrategyFactory {
    constructor(app) {
        this.app = app;
    }
    getStrategy() {
        try {
            if (location.protocol == "file:") return new HashStrategy(this.app);
            if (location.protocol == "http:") return new PathStrategy(this.app);
            if (location.protocol == "https:") return new PathStrategy(this.app);
        } catch (Error) {}
        return new HashStrategy(this.app);
    }
}

/**
 * Strategy for navigation based on location.hash
 */
export class HashStrategy {
    constructor(app) {
        this.app = app;
    }
    getCurrentLocation() {
        return (location.hash || "/").replace("#", "");
    }
    onClick(event, cb, app) {
        var href = event.target.href;
        href = href.replace("file://", "");
        var prev = location.hash;
        location.hash = href;

    }
}

/**
 * Strategy for navigation based on location.href
 */
export class PathStrategy {
    constructor(app) {
        this.app = app;
    }
    getCurrentLocation() {
        return (location.pathname || "/").replace((this.app.config["baseDir"] || ""), "");
    }
    onClick(event, cb, app) {
        var href = (this.app.config["baseDir"] || "") + event.target.pathname;
        history.pushState({}, '', href);
        try {
            cb();
        } catch (Error) {
            history.back();
            cb();
        }

    }
}
