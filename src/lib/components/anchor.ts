import { browser } from '$app/environment';
import { get_style } from '$lib/css';
import { get_element, type ElementReference } from '$lib/html';
import { unique_id } from '$lib/unique_id';
import { autoPlacement, autoUpdate, computePosition, offset, size } from '@floating-ui/dom';
import type { ActionReturn } from 'svelte/action';

export const anchoring_supported = browser
	? ('anchorName' in document.documentElement.style)
	: false;

export interface AnchorParameters {
	anchor: ElementReference;
	match_width?: boolean;
}

export function anchor(
	element: HTMLElement,
	options: AnchorParameters
): ActionReturn<AnchorParameters> {
	// Remove plugin when anchoring is fully supported
	// https://caniuse.com/?search=anchor
	const anchoring_supported = 'anchorName' in document.documentElement.style;

	update(options);

	return { update };

	function update(options: AnchorParameters) {
		const anchor_element = get_element(options.anchor);

		if (anchoring_supported) {
			let anchor_name = get_style(anchor_element, 'anchor-name');

			if (anchor_name === 'none') {
				anchor_name = `--${unique_id()}`;
				anchor_element.style.setProperty('anchor-name', anchor_name);
			}

			element.style.setProperty('position-anchor', anchor_name);
			element.classList.toggle('anchor--match-width', options.match_width);
		}
		else {
			const strategy = 'absolute'
			const middleware = [
				autoPlacement({
					allowedPlacements: ['top-start', 'bottom-start', 'top-end', 'bottom-end']
			}),
				offset(6),
				options.match_width && size({
					apply({ rects, elements }) {
						Object.assign(elements.floating.style, {
							'min-width': `max(var(--menu__min-width), ${rects.reference.width}px)`
						})
					}
				})
			];
	
			updatePosition();
	
			return autoUpdate(anchor_element, element, updatePosition)
	
			async function updatePosition() {
				const result = await computePosition(
					anchor_element,
					element,
					{
						middleware,
						strategy
					}
				);
	
				element.style.position = strategy;
				element.style.left = `${result.x}px`;
				element.style.top = `${result.y}px`;
			}
		}
	}
}
