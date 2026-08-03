import { get_style } from '$lib/css';
import { on } from '$lib/html';
import type { Heading, ListItem, Option, Separator, Text } from '$lib/internal';
import type { Attachment } from 'svelte/attachments';
import { on_resize } from './on_resize';

export type Prettier<T> = { [K in keyof T]: T[K] } & unknown

type VirtualListItem<T> =
	| VirtualHeading
	| VirtualOption<T>
	| VirtualSeparator
	| VirtualText;

type VirtualHeading = Prettier<Heading & VirtualValues>;
type VirtualOption<T> = Prettier<Option<T> & VirtualValues>;
type VirtualSeparator = Prettier<Separator & VirtualValues>;
type VirtualText = Prettier<Text & VirtualValues>;

type VirtualValues = {
	index: number;
	top: number;
	bottom: number;
}

export function virtualized_list<T>(
	list_items: () => ListItem<T>[],
	selected_value: () => string | null,
	list_item_height: ((item: ListItem<T>) => number)
) {
	let list_element = $state<HTMLElement>();
	let list_padding_left = $state('');
	let list_padding_right = $state('');

	const { virtual_items, first_index, first_items, last_index, last_items } = $derived(
		get_virtual_items(list_items())
	);
	const selected_item = $derived.by(() => {
		const value = selected_value();
		return value !== null
			? virtual_items.find(item => item.type === 'option' && item.value === value)
			: undefined
	});
	let paged_items = $derived(
		get_paged_items()
	);
	const visible_items = $derived([
		...first_items,
		...(
			selected_item &&
				paged_items.length > 0 &&
				selected_item.index > first_items.at(-1)!.index &&
				selected_item.index < paged_items[0].index
				? [selected_item]
				: []
		),
		...paged_items,
		...(
			selected_item &&
				paged_items.length > 0 &&
				selected_item.index > paged_items.at(-1)!.index &&
				selected_item.index < last_items[0].index
				? [selected_item]
				: []
		),
		...last_items,
	]);

	$effect(() => {
		const height = virtual_items.at(-1)?.bottom ?? 0;
		list_element?.style.setProperty('--height', `${height}px`);
	});

	return {
		get list_items() {
			return visible_items
		},
		handlers
	}

	function handlers(list: HTMLElement) {
		list_element = list;
		list.classList.add('virtualized-list');
		list.style.position = 'relative';
		list.style.overflow = 'auto';

		if (get_style(list, 'max-height') === 'none')
			list.style.maxHeight = 'inherit';

		const remove_observer = on_resize(list, refresh);
		const unsubscribe_event = on(list, { scroll: () => refresh() });

		return () => {
			list_element = undefined;
			list.classList.remove('virtualized-list');
			list.style.removeProperty('--height');
			remove_observer();
			unsubscribe_event();
		}

		function refresh() {
			// Inline padding is applied to absolute positioned list items
			const list_style = getComputedStyle(list);
			list_padding_left = list_style.getPropertyValue('padding-left');
			list_padding_right = list_style.getPropertyValue('padding-right');

			const new_items = get_paged_items();
			const updated =
				new_items.length !== paged_items.length ||
				(
					new_items.length > 0 &&
					new_items[0].id !== paged_items[0].id
				);

			// Do not update paged_items when items are the same to prevent needless rerender.
			if (updated)
				paged_items = new_items;
		}
	}

	function get_paged_items() {
		// Nothing left to page
		if (first_items.length + last_items.length === virtual_items.length)
			return [];

		return Array.from(get_items())

		function* get_items() {
			const [list_height, scroll_top] = list_element
				? [list_element.offsetHeight, list_element.scrollTop]
				: [200, 0];
			const list_top = scroll_top - list_height;
			const list_bottom = scroll_top + list_height * 2;

			for (let i = first_index + 1; i < last_index; i++) {
				const item = virtual_items[i];

				if (item.top > list_bottom)
					break;

				if (item.bottom >= list_top)
					yield item;
			}
		}
	}

	function get_virtual_items(list_items: ListItem<T>[]) {
		const virtual_items: VirtualListItem<T>[] = [];
		let first_index: number | undefined = undefined;
		let last_index: number | undefined = undefined;
		let top = 0;

		for (const list_item of list_items) {
			const height = list_item_height(list_item);
			if (height === 0)
				continue;

			const bottom = top + height;
			const index = virtual_items.length;
			const handlers = attachment(top);
			const virtual_item = { ...list_item, index, top, bottom, handlers };

			virtual_items.push(virtual_item);

			if (list_item.type === 'option') {
				if (first_index === undefined)
					first_index = index;
				else
					last_index = index;
			}

			top = bottom + 1; // Include row gap of one pixel.
		}

		first_index ??= 0;
		last_index ??= virtual_items.length;

		const first_items = virtual_items.slice(0, first_index + 1);
		const last_items = virtual_items.slice(last_index)

		return { virtual_items, first_index, first_items, last_index, last_items };

		function attachment(top: number): Attachment<HTMLElement> {
			return element => {
				element.style.position = 'absolute';
				element.style.top = `${top}px`;

				$effect(() => {
					element.style.left = list_padding_left
					element.style.right = list_padding_right
				})
			};
		}
	}
}
