
import {Application} from "../src/classes/Application";

new Application(
    {
        "/": require("./pages/Title"),
        "/about/": require("./pages/Title"),
        "/about/motivation": require("./pages/About/Motivation"),
        "/about/features": require("./pages/About/Features"),
        "/contact/": require("./pages/Contact"),
        "/docs/": require("./pages/Docs"),
        "/docs/<subject>/": require("./pages/Docs"),
    },
    {
        "baseDir": "/suit2"
    },
    {
        "bootstrap": require("./layouts/bootstrap"),
        "topMenu": require("./blocks/topMenu"),
        "aboutMenu": require("./blocks/aboutMenu"),
        "docsMenu": require("./blocks/docsMenu")
    }
)
