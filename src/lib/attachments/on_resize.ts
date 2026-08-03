import type { Attachment } from 'svelte/attachments';

interface OnResizeCallback {
	(size: { width: number; height: number }): void
}

export function on_resize(
	callback: OnResizeCallback
): Attachment

export function on_resize(
	element: Element,
	callback: OnResizeCallback,
): () => void

export function on_resize(
	...args:
		| [callback: OnResizeCallback]
		| [element: Element, callback: OnResizeCallback]
) {
	return args.length === 1
		? (element: Element) => attach(element, ...args)
		: attach(...args);

	function attach(element: Element, callback: OnResizeCallback) {
		const observer = new ResizeObserver(entries => {
			const {
				blockSize: height,
				inlineSize: width
			} = entries[0].borderBoxSize[0];

			callback({ width, height });
		});

		observer.observe(element);

		return () => observer.disconnect();
	}
}
