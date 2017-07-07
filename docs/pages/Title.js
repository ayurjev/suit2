export let name = 'TitlePage';

export let template = `
    {
        rebuild:bootstrap with {
            "submenu": "include:aboutMenu"
        }
    }
`;


export let init = function(internal) {

    internal.state.caption = `Freaking-simple microframework for building modern web-applications...`;
    internal.state.content = `
        <p>
            Designed to be be as powerfull as "react+redux+some kind of router" (but not that sophisticated) or as powerfull as angular (but not that verbose and opinionated).
        </p>
    `;
};
