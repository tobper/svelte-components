import { get_element, handle_keyboard_event, on, scroll_into_view, type ElementReference } from '$lib/html';

export function list_navigation({
	on_activate,
}: {
	on_activate: (list_item_id: string) => void,
}) {
	let list: HTMLElement | undefined;

	return {
		activate_first_item,
		activate_last_item,
		activate_next_item,
		activate_next_page,
		activate_previous_item,
		activate_previous_page,
		controller(controller: ElementReference) {
			return on(get_element(controller), {
				keydown: handle_keyboard_event({
					'ArrowUp': event => event.metaKey ? activate_first_item() : activate_previous_item(),
					'ArrowDown': event => event.metaKey ? activate_last_item() : activate_next_item(),
					'PageDown': activate_previous_page,
					'PageUp': activate_next_page,
				})
			})
		},
		handlers(element: HTMLElement) {
			list = element;
			return on(element, {
				keydown: handle_keyboard_event({
					'ArrowUp': event => event.metaKey ? activate_first_item() : activate_previous_item(),
					'ArrowDown': event => event.metaKey ? activate_last_item() : activate_next_item(),
					'PageDown': activate_previous_page,
					'PageUp': activate_next_page,
					'Home': activate_first_item,
					'End': activate_last_item,
				})
			})
		}
	}

	function activate_next_item() {
		const item = find_next('forward') ?? find_first_item();
		if (item)
			activate(item);
	}

	function activate_next_page() {
		// TODO:
	}

	function activate_previous_item() {
		const item = find_next('backward') ?? find_last_item();
		if (item)
			activate(item);
	}

	function activate_previous_page() {
		// TODO:
	}

	function activate_first_item() {
		const item = find_first_item();
		if (item)
			activate(item);
	}

	function activate_last_item() {
		const item = find_last_item();
		if (item)
			activate(item);
	}

	// Private functions

	function activate(option: Element) {
		scroll_into_view(option.id);
		on_activate(option.id);
	}

	function find_next(direction: 'forward' | 'backward') {
		const current = list?.querySelector('[aria-current]:not([aria-current="false"])');
		if (!current)
			return list?.querySelector('[aria-selected="true"]') ?? undefined;

		// Can't find next if starting point is invalid
		if (!is_option(current))
			return undefined;

		const get_next = direction === 'forward'
			? (node: Element) => node.nextElementSibling
			: (node: Element) => node.previousElementSibling;

		let child = current;

		while (true) {
			const next = get_next(child);

			// Reached end of list without finding an option
			if (!next)
				break;

			// Found an option
			if (is_option(next))
				return next;

			child = next;
		}

		return undefined;
	}

	function find_first_item() {
		if (!list)
			return null;

		let child: Element | null = list.children[0];

		while (child && !is_option(child))
			child = child.nextElementSibling;

		return child;
	}

	function find_last_item() {
		if (!list)
			return null;

		let child: Element | null = list.children[list.children.length - 1];

		while (child && !is_option(child))
			child = child.previousElementSibling;

		return child;
	}
}

function is_option(element: Element) {
	return element.role === 'option' && !!element.id;
}
