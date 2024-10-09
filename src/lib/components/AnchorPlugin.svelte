<script lang="ts">
	import { autoUpdate, computePosition, flip, shift, size } from '@floating-ui/dom';
	import { get_element } from '../html.js';

	interface MenuPlugin {
		anchor: HTMLElement | string;
		anchored: HTMLElement;
		visible: boolean;
	}

	const middleware = [
		flip({ boundary: 'clippingAncestors' }),
		shift(),
		size({
			apply({ rects, elements }) {
				Object.assign(elements.floating.style, {
					'min-width': `${rects.reference.width}px`,
				})
			}
		})
	];

	let {
		anchor: anchor_element_or_id,
		anchored,
		visible
	}: MenuPlugin = $props();

	$effect(() => {
		if (visible) {
			const anchor = get_element(anchor_element_or_id);

			return autoUpdate(anchor, anchored, updatePosition)

			async function updatePosition() {
				const result = await computePosition(
					anchor,
					anchored,
					{
						middleware,
						placement: 'bottom-start',
						strategy: 'absolute'
					}
				);

				anchored.style.left = `${result.x}px`;
				anchored.style.top = `${result.y}px`;
			}
		}
	});
</script>
