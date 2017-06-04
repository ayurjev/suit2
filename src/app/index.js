
import {Compiler,Widget} from "../classes/Compiler";

window.c = new Compiler(() => {
    return {
        "../app/test_inclusion": require("../app/test_inclusion")
    }
});
