export let name = 'DocsPage';

export let template = `
    {
        rebuild:bootstrap with {
            "submenu": "include:docsMenu"
        }
    }
`;


export let init = function(internal) {

    internal.state.caption = `Documentation`;
    internal.state.content = `
        <p>
            Under development
        </p>
    `;
};
