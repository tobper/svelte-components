export function toggle_class(element: Element, token: string, force?: boolean) {
	element.classList.toggle(token, force);
}

export function toggle_root_class(token: string, force?: boolean) {
	toggle_class(document.documentElement, token, force);
}

export function get_root_style_property(property: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(property);
}

export function set_root_style_property(property: string, value?: string) {
	if (value !== undefined)
		document.documentElement.style.setProperty(property, value);
	else
		document.documentElement.style.removeProperty(property);
}
