import { create_normalized_lookup, normalize } from '$lib/normalization';
import { async_value } from '$lib/reactivity.svelte';
import { tick } from 'svelte';

export type Awaitable<T> = T | PromiseLike<T>;
export type Loader<T> = (query: string) => Awaitable<T>;
export type Source<T> = Array<T> | Loader<Array<T>>;

export type ListItem<T> =
	| ListItemHeading<T>
	| ListItemOption<T>;

export interface ListItemHeading<T> {
	type: 'heading';
	id: string;
	label: string;
	children: ListItem<T>[]
}

export interface ListItemOption<T> {
	type: 'option';
	id: string;
	label: string;
	value: string;
	option: T;
	children: ListItem<T>[]
}

export function create_list<T>(
	list_id: string,
	type: 'select' | 'autocomplete',
	source: Source<T>,
	empty_text?: string,
	map_heading?: (option: T) => string | undefined,
	map_label?: (option: T) => string,
	map_value?: (option: T) => string,
	map_children?: (option: T) => (T[] | undefined),
) {
	let active_item = $state<ListItemOption<T> | null>(null);
	let current_value = $state('');
	let visible = $state(false);

	const all_items = async_value<Array<ListItem<T>>>([], {
		async on_updated(items) {
			if (!visible)
				return;

			if (items.length) {
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
	const option_items = $derived.by(() => {
		return [...iterate(all_items.current)]

		function* iterate(items: Iterable<ListItem<T>>): Iterable<ListItemOption<T>> {
			for (const item of items) {
				if (item.type === 'option')
					yield item;

				if ('children' in item) {
					yield* iterate(item.children);
				}
			}
		}
	});
	const option_items_lookup = $derived(
		create_normalized_lookup(option_items, item => item.label)
	);
	const load = $derived.by(() => {
		if (Array.isArray(source)) {
			const items = map_list_items(source);

			// Always display entire list if it contains five items or less
			if (countItems(items) <= 5)
				return () => items;

			return createItemLookup(items);
		}

		return (query: string) => Promise
			.resolve(source(query))
			.then(map_list_items);
	})

	if (Array.isArray(source)) {
		all_items.set(load(''));
	}

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
			active_item = null;
			current_value = new_value;
			visible = true;
			all_items.set(load(new_value))
		},
		open() {
			visible =
				all_items.loading ||
				all_items.current.length > 0 ||
				!!empty_text;
		},
		close() {
			active_item = null;
			current_value = '';
			visible = false;
		}
	};

	function map_list_items(options: T[]): ListItem<T>[] {
		const items: ListItem<T>[] = [];
		const headings = new Map<string, ListItemHeading<T>>();

		for (const option of options) {
			const heading = map_heading?.(option);
			const value = map_value?.(option) ?? `${option}`;
			const label = map_label?.(option) ?? value;
			const children = createChildren(map_children?.(option));
			const option_item = createOption(label, value, option, children);

			if (heading) {
				let heading_item = headings.get(heading);
				if (!heading_item) {
					heading_item = createHeading(heading);
					headings.set(heading, heading_item);
				}

				heading_item.children.push(option_item);
			}
			else {
				items.push(option_item);
			}
		}

		return items.concat(
			...headings.values().toArray().sort((x, y) =>
				x.label.localeCompare(y.label)
			)
		);

		function createHeading(heading: string): ListItemHeading<T> {
			const id = `${list_id}_${hash('heading', heading)}`;
			return { type: 'heading', id, label: heading, children: [] };
		}

		function createOption(label: string, value: string, option: T, children: ListItem<T>[]): ListItemOption<T> {
			const id = `${list_id}_${hash('option', value)}`;
			return { type: 'option', id, label, value, option, children };
		}

		function createChildren(children?: T[]): ListItem<T>[] {
			return children ? map_list_items(children) : [];
		}
	};

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

function countItems<T>(items: ListItem<T>[]): number {
	return items.reduce(
		(sum, item) => sum + 1 + countItems(item.children),
		0
	)
}

function createItemLookup<T>(items: ListItem<T>[]) {
	const filter_items = createFilterItems(items)

	return (query: string) => {
		const query_words = normalize(query).split(' ')
		return find(filter_items, query_words)
	}

	interface FilterItem<T> {
		words: string[]
		item: ListItem<T>
		children: FilterItem<T>[]
	}

	function createFilterItems<T>(items: ListItem<T>[]): FilterItem<T>[] {
		return items.map(item => ({
			words: normalize(item.label).split(' '),
			item,
			children: createFilterItems(item.children)
		}))
	}

	function find(items: FilterItem<T>[], query_words: string[]): ListItem<T>[] {
		return items.flatMap(item => {
			// Remove query words matching current item
			const rest_words = query_words.filter(
				query_word => !item.words.some(
					item_word => item_word.startsWith(query_word)
				)
			)

			// Items matches all remaining query words, return as is
			if (rest_words.length === 0)
				return [item.item]

			// At least one child matches remaining query words, return item with matching children
			const children = find(item.children, rest_words)
			if (children.length > 0)
				return [{ ...item.item, children }]

			// Item or children does not match remaining query words
			return []
		})
	}
}

// https://stackoverflow.com/a/52171480
function hash(...sources: (string | null | undefined)[]) {
	const seed = 0;
	const source = sources.filter(x => x).join(':')

	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < source.length; i++) {
		ch = source.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
