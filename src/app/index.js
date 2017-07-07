
import {Application} from "../classes/Application";


new Application(
    {
        "/": require("./pages/Title"),
        "/about/motivation": require("./pages/About/Motivation"),
        "/about/features": require("./pages/About/Features")
    },
    {},
    {
        "bootstrap": require("./layouts/bootstrap"),
        "topMenu": require("./blocks/topMenu"),
        "aboutMenu": require("./blocks/aboutMenu")
    }
)
