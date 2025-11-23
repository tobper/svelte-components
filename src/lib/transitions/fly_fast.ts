import { fly, type FlyParams } from 'svelte/transition';

export function fly_fast(
	node: Element,
	params: Exclude<FlyParams, 'duration'> = {}
) {
	return fly(node, { ...params, duration: 150 });
}
