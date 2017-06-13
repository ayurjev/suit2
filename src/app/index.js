
import {Compiler,Widget} from "../classes/Compiler";

window.widgets = {
    "./widgets/Main": require("./widgets/Main"),
};

window.router = {
    "strategy": "hash",
    
    "/": require("./widgets/Main"),
    "/page1/": require("./test_inclusion")
};

window.config = {user: {name: "Andrey", age: 28}};
