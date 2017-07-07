export let name = 'FeaturesPage';

export let template = `
    {
        rebuild:bootstrap with {
            "submenu": "include:aboutMenu"
        }
    }
`;


export let init = function(internal) {

    internal.state.caption = `Features`;
    internal.state.content = `
        Features should covered here...
    `;
};
