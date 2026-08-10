import { get_style } from '$lib/css';
import { get_element, type ElementReference } from '$lib/html';
import { unique_id } from '$lib/unique_id';
import type { ActionReturn } from 'svelte/action';

export interface AnchorParameters {
	anchor: ElementReference;
	match_width?: boolean;
}

export function anchor(
	element: HTMLElement,
	options: AnchorParameters
): ActionReturn<AnchorParameters> {
	update(options);

	return { update };

	function update(options: AnchorParameters) {
		const anchor_element = get_element(options.anchor);

		let anchor_name = get_style(anchor_element, 'anchor-name');
		if (anchor_name === 'none') {
			anchor_name = `--${unique_id()}`;
			anchor_element.style.setProperty('anchor-name', anchor_name);
		}

		element.style.setProperty('position-anchor', anchor_name);
		element.classList.toggle('anchor--match-width', options.match_width);
	}
}
