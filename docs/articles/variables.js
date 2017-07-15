
import {Internal} from "../../src/classes/Application";


export default class Variables extends Internal {
    constructor() {
        super();
        this.api.init_code = () => {
            return "code has been initiated";
        }
    }
    template() {
        return `VARS!`
    }
}
