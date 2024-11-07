<script lang="ts">
	import { autoPlacement, autoUpdate, computePosition, offset, size } from '@floating-ui/dom';
	import { get_element } from '../html.js';

	interface MenuPlugin {
		anchor: HTMLElement | string;
		anchored: HTMLElement | string;
		width?: 'anchor' | 'content';
	}

	let {
		anchor: anchor_element_or_id,
		anchored: anchored_element_or_id,
		width = 'content'
	}: MenuPlugin = $props();

	$effect(() => {
		const anchor = get_element(anchor_element_or_id);
		const anchored = get_element(anchored_element_or_id);
		const strategy = 'absolute'
		const middleware = [
			autoPlacement({
				allowedPlacements: ['top-start', 'bottom-start']
			}),
			offset(6),
			width === 'anchor' && size({
				apply({ rects, elements }) {
					Object.assign(elements.floating.style, {
						width: `max(var(--menu__min-width), ${rects.reference.width}px)`
					})
				}
			})
		];

		updatePosition();

		return autoUpdate(anchor, anchored, updatePosition)

		async function updatePosition() {
			const result = await computePosition(
				anchor,
				anchored,
				{
					middleware,
					strategy
				}
			);

			anchored.style.position = strategy;
			anchored.style.left = `${result.x}px`;
			anchored.style.top = `${result.y}px`;
		}
	});
</script>
