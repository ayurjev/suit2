
import {Application} from "../src/classes/Application";

new Application(
    {
        "/": require("./pages/Title"),
        "/about/motivation": require("./pages/About/Motivation"),
        "/about/features": require("./pages/About/Features"),
        "/docs/": require("./pages/Docs"),
        "/contact/": require("./pages/Contact")
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
