export function toggle_class(element: Element, token: string, force?: boolean) {
	element.classList.toggle(token, force)
}

export function toggle_root_class(token: string, force?: boolean) {
	toggle_class(document.documentElement, token, force)
}

export function get_style(element: Element, property: string) {
	return getComputedStyle(element).getPropertyValue(property)
}

export function set_style(element: HTMLElement | SVGElement, property: string, value?: string) {
	if (value !== undefined)
		element.style.setProperty(property, value)
	else
		element.style.removeProperty(property)
}

export function get_style_property(element: HTMLElement | SVGElement, property: string): CssProperty {
	return {
		get value() {
			return get_style(element, property)
		},
		set value(value) {
			set_style(element, property, value)
		}
	}
}

export function get_root_style(property: string): string
export function get_root_style(property: string, syntax: 'time'): number
export function get_root_style(property: string, syntax?: 'time') {
	const value = get_style(document.documentElement, property)

	if (syntax === 'time') {
		const num = parseFloat(value)
		return value.endsWith('s') ? num * 1000 : num
	}

	return value
}

export function set_root_style(property: string, value?: string) {
	set_style(document.documentElement, property, value)
}

export interface CssProperty {
	value: string
}

export function wait_for_animation(callback: () => unknown) {
		const delay = get_root_style('--transition__duration--fast', 'time')

		setTimeout(callback, delay)
	}
