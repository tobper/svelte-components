// TODO: This is not triggered if the page height is less than 100%
// TODO: Test implementation using scrolltop and top instead
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
