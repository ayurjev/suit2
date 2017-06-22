
import {App} from "../classes/App";

new App({
    "/": require("./widgets/Main"),
    "/page1/": require("./test_inclusion"),
    "/page1/subpage/": require("./subpage")
},
    {user: {name: "Andrey", age: 28}}
)
