export let name = 'MotivationPage';

export let template = `
    {
        rebuild:bootstrap with {
            "submenu": "include:aboutMenu"
        }
    }
`;


export let init = function(internal) {

    internal.state.caption = `Motivation`;
    internal.state.content = `
        Motivation should be explained here...
    `;

};
