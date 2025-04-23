import { get_element, on, type ElementReference } from '$lib/html';
import type { ActionReturn } from 'svelte/action';

const menu_item_selector = '.menu-item:not([aria-disabled])';

interface MenuHandlerParameters {
	trigger: ElementReference;
}

interface MenuItemHandlerParameters {
	activate(): void
}

export function menu_handlers(
	menu: HTMLElement,
	options: MenuHandlerParameters
): ActionReturn<MenuHandlerParameters> {
	let trigger: HTMLElement | null = null;

	const remove_menu_handlers = attach_menu_handlers();
	let remove_trigger_handlers = attach_trigger_handlers(options);

	return {
		destroy() {
			remove_menu_handlers();
			remove_trigger_handlers?.();
		},
		update(options) {
			remove_trigger_handlers?.();
			remove_trigger_handlers = attach_trigger_handlers(options);
		}
	}

	function attach_menu_handlers() {
		return on(menu, {
			focusout(event) {
				onblur(event);
			},
			toggle(event) {
				const opened =
					event instanceof ToggleEvent &&
					event.newState === 'open';

				if (!opened)
					return;

				// Do not set focus if a menu item is already focused
				// This happens for instance when arrow up is pressed on the trigger
				if (menu.matches(':focus-within'))
					return;

				focus_first_menu_item(menu);
			}
		})
	}

	function attach_trigger_handlers(options: MenuHandlerParameters) {
		trigger = get_element(options.trigger);

		if (!trigger)
			return;

		return on(trigger, {
			blur(event) {
				onblur(event);
			},
			click() {
				menu.showPopover();
			},
			keydown(event) {
				switch (event.key) {
					case 'ArrowDown':
						event.preventDefault();
						menu.showPopover();
						focus_first_menu_item(menu);
						break;

					case 'ArrowUp':
						event.preventDefault();
						menu.showPopover();
						focus_last_menu_item(menu);
						break;
				}
			}
		})
	}

	function onblur(event: FocusEvent) {
		const focused_element = event.relatedTarget;
		const keep_open =
			focused_element instanceof Node &&
			(
				menu.contains(focused_element) ||
				trigger?.contains(focused_element)
			);

		if (!keep_open)
			menu.hidePopover();
	}
}

export function menu_item_handlers(
	menu_item: HTMLElement,
	options: MenuItemHandlerParameters
) {
	const { activate } = options;
	const remove_event_listeners =
		on(menu_item, {
			blur() {
				menu_item.tabIndex = -1;
			},
			focus() {
				menu_item.tabIndex = 0;
			},
			click() {
				if (is_enabled())
					activate();
			},
			mouseover() {
				if (is_enabled())
					menu_item.focus()
			},
			keydown(event) {
				switch (event.key) {
					case 'ArrowDown':
						focus_next_sibling(menu_item);
						break;

					case 'ArrowUp':
						focus_previous_sibling(menu_item);
						break;

					case ' ':
					case 'Enter':
						if (is_enabled())
							activate();
						break;
				}
			}
		});

	return {
		destroy() {
			remove_event_listeners();
		}
	}

	function is_enabled() {
		return !menu_item.matches('[aria-disabled]');
	}
}

function is_menu_item(child: Element): child is HTMLElement {
	return (
		child instanceof HTMLElement && 
		child.matches(menu_item_selector)
	);
}

function* iterate_menu_items(menu: Element) {
	for (const child of menu.children) {
		if (is_menu_item(child))
			yield child;
	}
}

function get_first_menu_item(menu: Element) {
	for (const child of iterate_menu_items(menu))
		return child;

	return null;
}

function get_last_menu_item(menu: Element) {
	let last_item: HTMLElement | null = null;

	for (const child of iterate_menu_items(menu))
		last_item = child;

	return last_item;
}

function focus_first_menu_item(menu: Element) {
	get_first_menu_item(menu)?.focus();
}

function focus_last_menu_item(menu: Element) {
	get_last_menu_item(menu)?.focus();
}

function focus_next_sibling(menu_item: Element) {
	let sibling: Element | null = menu_item;

	while (sibling) {
		sibling = sibling.nextElementSibling;

		if (sibling && is_menu_item(sibling)) {
			sibling.focus();
			return;
		}
	}

	if (menu_item.parentElement)
		focus_first_menu_item(menu_item.parentElement);
}

function focus_previous_sibling(menu_item: Element) {
	let sibling: Element | null = menu_item;

	while (sibling) {
		sibling = sibling.previousElementSibling;

		if (sibling && is_menu_item(sibling)) {
			sibling.focus();
			return;
		}
	}

	if (menu_item.parentElement)
		focus_last_menu_item(menu_item.parentElement);
}
