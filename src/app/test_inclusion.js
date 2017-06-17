export let template = `His name is <b>{$user.name}</b> and he is {$user.age} years old`

export let init = function(internal) {
    internal.bugaga = "111";
    internal.api.createListeners = function() {
        internal.broadcast("TEST_INCLUSION_INITED", {a: 42});
    };

    internal.api.change = function(name, age) {
        internal.state.user.name = name;
        internal.state.user.age = age;
        internal.state.local_property = "xxx";
        internal.refresh();
    }

    internal.api.get_state = function() {
        return internal.state;
    }


};
