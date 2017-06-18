
import {Compiler,Widget} from "../classes/Compiler";

window.router = {
    "/": require("./widgets/Main"),
    "/page1/": require("./test_inclusion"),
    "/page1/subpage/": require("./subpage")
};

window.config = {user: {name: "Andrey", age: 28}};
