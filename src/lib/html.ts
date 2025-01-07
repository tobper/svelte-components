// TODO: This is not triggered if the page height is less than 100%
// TODO: Test implementation using scroll-top and top instead
export interface InteractionObserverOptions {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
	threshold?: number | number[];
}

export function interaction_observer(
	element: Element,
	callback: (intersecting: boolean) => void,
	options?: InteractionObserverOptions
) {
	const observer = create();
	observer.observe(element);

	return { disconnect };

	function create() {
		const { top = 0, right = 0, bottom = 0, left = 0, threshold = 1 } = options ?? {};

		return new IntersectionObserver(
			([{ isIntersecting }]) => callback(isIntersecting),
			{
				rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
				threshold
			}
		);
	}

	function disconnect() {
		observer?.disconnect();
	}
}

export function resize_observer(
	element: Element,
	callback: (rectangle: DOMRectReadOnly) => void
) {
	const observer = create();
	observer.observe(element);

	return { disconnect };

	function create() {
		return new ResizeObserver(([{ contentRect }]) => callback(contentRect));
	}

	function disconnect() {
		observer.disconnect();
	}
}

/*

*/
export function scroll_into_view(
	element_id: string | undefined,
	position: ScrollLogicalPosition = 'nearest'
) {
	const element = element_id && document.querySelector(`#${element_id}`);
	if (element)
		element.scrollIntoView({ block: position });
}

/*
	Element query
*/
export function assert_element<T>(element: T): asserts element is NonNullable<T>;
export function assert_element<T>(element: unknown, type: ({ new(...args: []): T })): asserts element is NonNullable<T>;
export function assert_element<T>(element: unknown, type?: ({ new(...args: []): T })) {
	if (element == null)
		throw new Error(`Element is not defined`);

	if (type && !is_of_type(element, type))
		throw new Error(`Element is not of type ${type.name}`);

	return element;
}

export function focus_element(element_or_id: string | HTMLElement) {
	get_element(element_or_id).focus();
}

export function get_optional_button_element(selector: string) {
	const element = document.querySelector(selector);

	return element && is_of_type(element, HTMLButtonElement) ? element : null;
}

export function get_button_element(selector: string) {
	const element = document.querySelector(selector);

	return ensure_type(selector, element, HTMLButtonElement);
}

export function get_element(element_or_id: string | HTMLElement) {
	if (element_or_id instanceof HTMLElement)
		return element_or_id;

	const element = document.querySelector(`#${element_or_id}`);

	return ensure_type(element_or_id, element, HTMLElement);
}

function ensure_type<T>(
	selector: string,
	element: Element | null,
	type: { new(...args: []): T }
): T {
	if (!element)
		throw new Error(`Element with selector '${selector}' was not found`);

	if (is_of_type(element, type))
	  return element;

	throw new Error(`Element with selector '${selector}' is not of type ${type.name}`);
}

function is_of_type<T>(
	value: unknown,
	type: { new(...args: []): T }
): value is T {
	return value instanceof type;
}
