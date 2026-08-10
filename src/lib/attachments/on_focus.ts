import { on } from '$lib/html';
import type { Attachment } from 'svelte/attachments';

export function on_focus(
	focus_in: (event: FocusEvent) => ((event: FocusEvent) => void) | void
): Attachment

export function on_focus(
	focus_in: (event: FocusEvent) => void,
	focus_out: (event: FocusEvent) => void,
): Attachment

export function on_focus(
	...args:
		| [focus_in: (event: FocusEvent) => ((event: FocusEvent) => void) | void]
		| [focus_in: (event: FocusEvent) => void, focus_out: (event: FocusEvent) => void]
): Attachment<HTMLElement> {
	return element => {
		const [focus_in] = args;
		let focus_out: ((event: FocusEvent) => void) | void;

		return on(element, {
			focusin(event) {
				focus_out = focus_in(event) ?? args[1];
			},
			focusout(event) {
				if (focus_out) {
					focus_out(event);
					focus_out = undefined;
				}
			}
		})
	}
}
