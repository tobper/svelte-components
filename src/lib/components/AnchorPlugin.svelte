<script lang="ts">
	import { autoPlacement, autoUpdate, computePosition, offset, size } from '@floating-ui/dom';
	import { get_element } from '../html.js';

	interface MenuPlugin {
		anchor: HTMLElement | string;
		anchored: HTMLElement | string;
	}

	let {
		anchor: anchor_element_or_id,
		anchored: anchored_element_or_id,
	}: MenuPlugin = $props();

	$effect(() => {
		const anchor = get_element(anchor_element_or_id);
		const anchored = get_element(anchored_element_or_id);
		const strategy = 'absolute'

		anchored.style.marginTop = `0px`;
		anchored.style.position = strategy;

		updatePosition();

		return autoUpdate(anchor, anchored, updatePosition)

		async function updatePosition() {
			const result = await computePosition(
				anchor,
				anchored,
				{
					middleware: [
						autoPlacement({
							alignment: 'start',
						}),
						offset(6),
						size({
							apply({ rects, elements }) {
								Object.assign(elements.floating.style, {
									'min-width': `max(var(--menu__min-width), ${rects.reference.width}px)`,
								})
							}
						})
					],
					strategy
				}
			);

			anchored.style.left = `${result.x}px`;
			anchored.style.top = `${result.y}px`;
		}
	});
</script>
