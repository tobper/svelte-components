import { get_style, set_style, toggle_class } from '$lib/css';
import { get_element, type ElementReference } from '$lib/html';
import { unique_id } from '$lib/unique_id';
import type { ActionReturn } from 'svelte/action';

export const anchoring_supported = 'anchorName' in document.documentElement.style;

export interface AnchorParameters {
	anchor: ElementReference;
	match_width?: boolean;
}

export function anchor(
	element: HTMLElement,
	options: AnchorParameters
): ActionReturn<AnchorParameters> {
	if (!anchoring_supported)
		return {};

	update(options);

	return { update };

	function update(options: AnchorParameters) {
		const anchor_element = get_element(options.anchor);
		let anchor_name = get_style(anchor_element, 'anchor-name');

		if (anchor_name === 'none') {
			anchor_name = `--${unique_id()}`;
			set_style(anchor_element, 'anchor-name', anchor_name);
		}

		set_style(element, 'position-anchor', anchor_name);
		toggle_class(element, 'anchor--match-width', options.match_width);
	}
}
