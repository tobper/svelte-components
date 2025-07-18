import { slide } from 'svelte/transition'

export const slide_fast =
	(node: Element) =>
		slide(node, { duration: 150 })
