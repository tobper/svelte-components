import { scale, type ScaleParams } from 'svelte/transition';

export function scale_fast(
	node: Element,
	params: Exclude<ScaleParams, 'duration'> = {}
) {
	const { start = 0.95 } = params;
	return scale(node, { ...params, start, duration: 150 });
}
