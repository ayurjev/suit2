export let name = 'TitlePage';

export let template = `
    {
        rebuild:bootstrap with {
            "submenu": "include:aboutMenu"
        }
    }
`;


export let init = function(internal) {

    internal.state.caption = `Suit is a micro-framework for building UI that has everything you need and as easy as it can possibly be`;
    internal.state.content = `
        Title text should be placed here...
    `;
};
