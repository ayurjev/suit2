export let template = `
    <div>
        His name is <b>{$user.name}</b> and he is {$user.age} years old<br />
        {include:test_inclusion}
    </div>
`;


export let init = function(internal) {

    internal.includes = {
        "test_inclusion": require("../test_inclusion")
    };

    internal.api.createListeners = function() {
        internal.say();
    };

    internal.api.say = () => { internal.say(); }

    internal.say = () => { alert("hello"); }
};
