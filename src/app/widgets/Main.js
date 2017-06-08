export let template = `
    <div>
        His name is <b>{$user.name}</b> and he is {$user.age} years old
    </div>
`;

export let init = function(internal) {
    internal.api.createListeners = function() {
        internal.say();
    };
    internal.api.say = () => { internal.say(); }
    internal.say = () => { alert("hello"); }
};
