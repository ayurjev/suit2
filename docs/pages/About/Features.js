
import {Internal} from "../../../src/classes/Application";


export default class FeaturesPage extends Internal {
    template() {
        return `{rebuild:bootstrap with
            {submenu: include:aboutMenu},
            {caption: Features & Ideas"},
            {content:
                <ul>
                    <li>ES6 compatible</li>
                    <li>Freaking lightweight and compact runtime (24kb raw lib)</li>
                    <li>No runtime dependencies (dev-dependencies only)</li>
                    <li>Component-oriented approach (incapsulation)</li>
                    <li>Event-driven approach (pub/sub model)</li>
                    <li>Single-state (app wide) or Local-state (component wide)</li>
                    <li>Built-in and very simple router</li>
                    <li>Great support for static sites (file:// protocol supported)</li>
                    <li>No auto-refreshing of the DOM (manual, on purpose)</li>
                    <li>State mutations allowed</li>
                    <li>No requirements for the project structure</li>
                    <li>Any approach for the CSS</li>
                    <li>No props (child component inherits parent's state)</li>

                    <li class='future'>Automated assignment of '.active' for the 'a' tags (optional)</li>
                    <li class='future'>Built-in tool for ajax-requests (optional)
                    <li class='future'>Server-side rendering support (optional)</li>
                    <li class='future'>Bundle.js sharding (optional)</li>
                    <li class='future'>Component-only styles (optional)</li>
                </ul>
            }
        }`
    }
};
