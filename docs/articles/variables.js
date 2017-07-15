
import {Internal} from "../../src/classes/Application";


export default class Variables extends Internal {
    constructor() {
        super();
        this.api.initCode = this.initCode;

        
    }
    template() {
        return `VARS!`
    }

    init() {
        console.dir("code instantiated")
    }

    createListeners() {
        alert("createListeners");
        this.initCode();
    }

    initCode() {
        console.dir("code inited");
    }
}
