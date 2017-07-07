export let template = `
	<div class="wrapper">
		<header>
			<h1><a href="/">Suit</a></h1>
			{include:topMenu}
			{$submenu || ""}
		</header>
		<section>
            <h1 class="post-title">{$caption}</h1>
			<br />
            {$content || DEFAULT-CONTENT}
        </section>
    </div>
`;
