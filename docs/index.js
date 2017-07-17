
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
        "/pg/": require("./pages/Pg")
    },
    {
        "baseDir": "/suit2"
    },
    {
        "Bootstrap": require("./layouts/Bootstrap"),
        "TopMenu": require("./blocks/TopMenu"),
        "AboutMenu": require("./blocks/AboutMenu"),
        "DocsMenu": require("./blocks/DocsMenu")
    }
)
