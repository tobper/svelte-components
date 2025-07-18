import { cubicOut } from 'svelte/easing'
import type { TransitionConfig } from 'svelte/transition'

export function appear(node: Element, direction: 'from_left' = 'from_left'): TransitionConfig {
	const style = getComputedStyle(node)
	const margin_left = parseFloat(style['marginLeft'])
	const margin_right = parseFloat(style['marginRight'])
	const element_width = parseFloat(style['width'])
	const full_width = margin_left + element_width + margin_right

	return {
		delay: 0,
		duration: 150,
		easing: cubicOut,
		css: direction === 'from_left'
			? (t, u) =>
				`clip-path: inset(0 0 0 ${minMax(0, u * full_width, element_width)}px);` +
				`margin-left: ${margin_left - u * full_width}px;`
			: (t, u) =>
				`clip-path: inset(0 ${minMax(0, u * full_width, element_width)}px 0 0);` +
				`margin-right: ${margin_right - u * full_width}px;`
	}

	function minMax(min: number, value: number, max: number) {
		return Math.min(Math.max(value, min), max)
	}
}
