export let template = `
    <div>
        His <a href="/page1/">name</a> is <b>{$user.name}</b> and he is {$user.age} <a href="/page1/subpage/">years</a> old<br />
        {include:test_inclusion}
    </div>
`;


export let init = function(internal) {

    internal.includes = {
        "test_inclusion": require("../test_inclusion")
    };

    internal.api.createListeners = function() {
        //internal.say();
        internal.subscribe("TEST_INCLUSION_INITED", (e) => { console.dir(e); internal.say(); });
    };

    internal.api.say = () => { internal.say(); }

    internal.api.change = () => {
        internal.state.user.name = "Alexey";
        internal.state.user.age = 42;
        internal.refresh();
    }

    internal.say = () => { alert("hello"); }
};
