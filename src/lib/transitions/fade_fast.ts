import { fade, type FadeParams } from 'svelte/transition';

export function fade_fast(
	node: Element,
	params: Exclude<FadeParams, 'duration'> = {}
) {
	return fade(node, { ...params, duration: 150 });
}
