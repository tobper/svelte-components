import { slide, type SlideParams } from 'svelte/transition';

export function slide_fast(
	node: Element,
	params: Exclude<SlideParams, 'duration'> = {}
) {
	return slide(node, { ...params, duration: 150 })
}
