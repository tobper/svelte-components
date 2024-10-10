<script lang="ts">
	import { autoPlacement, autoUpdate, computePosition, offset, size, type Placement } from '@floating-ui/dom';
	import { get_element } from '../html.js';

	interface MenuPlugin {
		anchor: HTMLElement | string;
		anchored: HTMLElement | string;
		placement?: Placement;
	}

	const middleware = [
		autoPlacement(),
		offset(6),
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
		anchored: anchored_element_or_id,
		placement = 'bottom-start',
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
					middleware,
					placement,
					strategy
				}
			);

			anchored.style.left = `${result.x}px`;
			anchored.style.top = `${result.y}px`;
		}
	});
</script>
