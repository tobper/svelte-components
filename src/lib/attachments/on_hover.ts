import { on } from '$lib/html';
import type { Attachment } from 'svelte/attachments';

export function on_hover(
	hover_in: (event: MouseEvent) => ((event: MouseEvent) => void) | void
): Attachment

export function on_hover(
	hover_in: (event: MouseEvent) => void,
	hover_out: (event: MouseEvent) => void,
): Attachment

export function on_hover(
	...args:
		| [hover_in: (event: MouseEvent) => ((event: MouseEvent) => void) | void]
		| [hover_in: (event: MouseEvent) => void, hover_out: (event: MouseEvent) => void]
): Attachment<HTMLElement> {
	return element => {
		const [hover_in] = args;
		let hover_out: ((event: MouseEvent) => void) | void;

		return on(element, {
			mouseover(event) {
				if (!is_child(event.relatedTarget))
					hover_out = hover_in(event) ?? args[1];
			},
			mouseout(event) {
				if (hover_out && !is_child(event.relatedTarget)) {
					hover_out(event);
					hover_out = undefined;
				}
			}
		});

		function is_child(related: EventTarget | null) {
			return (
				related instanceof Element &&
				element.contains(related)
			);
		}
	}
}
