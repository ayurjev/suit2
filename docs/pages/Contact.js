export let name = 'ContactPage';

export let template = `
    {
        rebuild:bootstrap with {
            "content": "
                <p>
                    Github: <a href='https://github.com/ayurjev/suit2'>https://github.com/ayurjev/suit2</a>
                </p>
                <p>
                    Contact me: <a href='mailto:$email'>$email</a>
                </p>
            "
        }
    }
`;


export let init = function(internal) {

    internal.state.caption = `Contact me`;

    internal.api.createListeners = function() {
        internal.state.email = "andrey.yurjev@gmail.com";
        internal.refresh();
    }
};
