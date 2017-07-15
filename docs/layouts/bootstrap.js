
import {Component} from "../../src/classes/Component";


export default class Bootstrap extends Component {
	template() {
		return `
			<div class="wrapper">
				<header>
					<h1><a href="/">Suit</a></h1>
					{include:TopMenu}
					{$submenu || ""}
				</header>
				<section>
		            <h1 class="post-title">{$caption}</h1>
					<br />
		            {$content || DEFAULT-CONTENT}
		        </section>
		    </div>
		`;
	}
}
