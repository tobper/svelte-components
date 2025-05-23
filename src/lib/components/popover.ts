import type { ActionReturn } from 'svelte/action';

export interface PopoverParameters {
	animation?: 'fade' | 'slide' | 'none';
	modal?: boolean;
	visible?: boolean;
}

export function popover(
	element: HTMLElement,
	options: PopoverParameters
): ActionReturn<PopoverParameters> {
	update(options);

	return { destroy, update };

	function destroy() {
		element.hidePopover();
		element.classList.remove('popover--modal');
		element.classList.remove('popover--fade');
		element.classList.remove('popover--slide');
		element.classList.remove('popover--visible');
	}

	function update({
		modal = false,
		animation = 'none',
		visible = false
	}: PopoverParameters) {
		// We're using a class to toggle visible state instead of the 'popover-open' pseudo-class
		// because for some reason the pseudo-class doesn't work on iOS. Popovers gets hidden
		// but selectors checking if there is an open popover are still triggered.

		element.classList.add('popover');
		element.classList.toggle('popover--modal', modal);
		element.classList.toggle('popover--fade', animation === 'fade');
		element.classList.toggle('popover--slide', animation === 'slide');
		element.classList.toggle('popover--visible', visible);
		element.togglePopover(visible);
	}
}
