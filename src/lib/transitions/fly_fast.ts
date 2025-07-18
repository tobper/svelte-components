import { fly } from 'svelte/transition'

export const fly_fast =
	(node: Element, { x, y }: { x?: number | string; y?: number | string }) =>
		fly(node, { duration: 150, x, y })
