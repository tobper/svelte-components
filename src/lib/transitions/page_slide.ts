import { fly } from 'svelte/transition'

export function page_slide(direction: 'left' | 'right') {
	const duration = 200
	const opacity = 0
	const x = direction === 'left' ? '30%' : '-30%'

	return function (node: Element) {
		return fly(node, { x, duration, opacity })
	}
}
