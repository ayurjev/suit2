export let template = `His name is <b>{$user.name}</b> and he is {$user.age} years old`

export let init = function(internal) {

    internal.api.createListeners = function() {
        internal.broadcast("TEST_INCLUSION_INITED", {a: 42});
    };

    internal.api.change = function(name, age) {
        internal.state.user.name = name;
        internal.state.user.age = age;
        internal.refresh();
    }

};
