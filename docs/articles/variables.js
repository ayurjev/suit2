
import {Component} from "../../src/classes/Component";


export default class Variables extends Component {

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
