import { create_normalized_lookup } from '$lib/normalization';
import { async_value, type Source } from '$lib/reactivity.svelte';
import { tick } from 'svelte';

export type ListItem<T> =
	| ListItemHeading
	| ListItemPresentation
	| ListItemOption<T>;

export interface ListItemHeading {
	type: 'heading';
	label: string;
}

export interface ListItemPresentation {
	type: 'presentation';
	label: string;
}

export interface ListItemOption<T> {
	type: 'option';
	id: string;
	label: string;
	value: string;
	option: T;
}

export function create_list<T>(
	list_id: string,
	type: 'select' | 'autocomplete',
	source: Source<Array<T>, [query: string]>,
	empty_text?: string,
	map_heading?: (option: T) => string,
	map_label?: (option: T) => string,
	map_value?: (option: T) => string,
) {
	let active_item = $state<ListItemOption<T> | null>(null);
	let current_value = $state('');
	let visible = $state(false);

	const all_items = async_value<Array<ListItem<T>>>([], {
		async on_updated(items) {
			if (!visible)
				return;

			if (items) {
				if (type === 'select') {
					// Wait for dom to update
					await tick();
					activate_item_starting_with(current_value);
				}
			}
			else {
				visible = false;
			}
		}
	});
	const option_items = $derived(
		all_items.current.filter(item => item.type === 'option')
	);
	const option_items_lookup = $derived(
		create_normalized_lookup(option_items, item => item.label)
	);

	if (Array.isArray(source))
		all_items.set(map_list_items(source));

	return {
		get active_item() { return active_item; },
		get id() { return list_id; },
		get items() { return all_items.current; },
		get loaded() { return all_items.loaded; },
		get loading_delayed() { return all_items.delayed; },
		get visible() { return visible; },
		activate,
		activate_value,
		activate_item_starting_with,
		activate_first_item,
		activate_last_item,
		activate_next_item,
		activate_previous_item,
		get_item_with_label(text: string) {
			return option_items.find(item => item.label === text);
		},
		load_items(new_value: string) {
			if (Array.isArray(source))
				return;

			active_item = null;
			current_value = new_value;
			visible = true;

			if (new_value) {
				const promise = Promise
					.resolve(source(new_value))
					.then(map_list_items);
	
				all_items.set(promise);
			}
			else {
				all_items.reset();
			}
		},
		open() {
			visible =
				all_items.loading ||
				all_items.current.length > 0;
		},
		close() {
			active_item = null;
			current_value = '';
			visible = false;
		}
	};

	function map_list_items(options: T[]): Array<ListItem<T>> {
		const mapped_options = Object
			.entries(
				Object.groupBy(
					options.map(option => {
						const heading = map_heading?.(option);
						const value = map_value?.(option) ?? `${option}`;
						const label = map_label?.(option) ?? value;
						const id = [list_id, hash(heading), hash(value)].filter(x => x).join('_');
			
						return { option, id, heading, label, value };
					}),
					item => item.heading ?? ''
				)
			)
			.flatMap(([heading, group_items = []]) => {
				const items = group_items.map<ListItem<T>>(({ id, label, value, option }) =>
					({ type: 'option', id, label, value, option, })
				);

				if (heading)
					items.unshift({ type: 'heading', label: heading });

				return items;
			});

		if (empty_text)
			mapped_options.unshift({ type: 'presentation', label: empty_text });

		return mapped_options;
	}

	function get_next_item() {
		return get_item(
			(current, length) => current !== -1 && current < length - 1 ? current + 1 : 0
		);
	}

	function get_previous_item() {
		return get_item(
			(current, length) => current >= 1 ? current - 1 : length - 1
		);
	}

	function get_item(next_index: (current: number, length: number) => number) {
		if (option_items.length === 0)
			return null;

		const current_item = active_item;
		const current_index = current_item
			? option_items.indexOf(current_item)
			: -1;

		return option_items[next_index(current_index, option_items.length)];
	}

	function activate(item: ListItemOption<T> | null) {
		active_item = item;
		return item;
	}

	function activate_value(value: string) {
		const item = option_items.find(item => item.value === value);

		if (item)
			activate(item);

		return item;
	}

	function activate_next_item() {
		return activate(get_next_item());
	}

	function activate_previous_item() {
		return activate(get_previous_item());
	}

	function activate_first_item() {
		if (option_items.length)
			return activate(option_items[0]);

		return null;
	}

	function activate_last_item() {
		if (option_items.length)
			return activate(option_items[option_items.length - 1]);

		return null;
	}

	function activate_item_starting_with(value: string) {
		if (all_items.loading)
			return;

		const item = option_items_lookup.find(value);

		return activate(item);
	}
}

// https://stackoverflow.com/a/52171480
function hash(source: string | undefined, seed = 0) {
	if (source === undefined)
		return seed;

	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < source.length; i++) {
		ch = source.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
