<script lang="ts" generics="Option">
	import type { ClassValue, HTMLColAttributes } from 'svelte/elements';
	import { scroll_into_view } from '../html.js';
	import { create_normalized_lookup } from '../normalization.js';
	import { unique_id } from '../unique_id.js';
	import EventHandler from './EventHandler.svelte';
	import List from './List.svelte';
	import ListItemHeading from './ListItemHeading.svelte';
	import ListItemOption from './ListItemOption.svelte';
	import ListItemSeparator from './ListItemSeparator.svelte';
	import ListItemText from './ListItemText.svelte';

	interface ListItem {
		id: string;
		label: string;
		value: string;
		option: Option;
	}

	interface SelectList {
		/**
		 * Id of the currently activated list item.  
		 * Used to set active descendant in parent controls.
		 */
		active_item_id?: string | null;
		/**
		 * A string value that labels the interactive list.
		 */
		aria_label?: HTMLColAttributes['aria-label'];
		/**
		 * Class to apply to the list element.
		 */
		class?: ClassValue;
		/**
		 * Determines if it should be possible to tab to the list.  
		 * Set this to false when displayed in combobox menus.
		 */
		focusable?: boolean;
		/**
		 * A text item will be added with this text if no options exist.
		 */
		empty_text?: string;
		/**
		 * The element id of the list.
		 */
		id?: string;
		/**
		 * Element to attach navigation keyboard events to.
		 */
		keyboard_capture?: HTMLElement | string;
		/**
		 * Options to display in the list.
		 */
		options: Option[];
		/** 
		 * Callback that is called for each option to determine the label of the option.
		 * @default No header is displayed.
		 */
		options_heading?: (option: Option) => string;
		/**
		 * Callback that is called for each option to determine the label of the option.
		 * @default Value is displayed as label.
		 */
		options_label?: (option: Option) => string;
		/**
		 * Callback that is called for each option to determine the value of the option.
		 * @default Option is converted to a string.
		 */
		options_value?: (option: Option) => string;
		/**
		 * The value of the option currently selected.
		 */
		value?: string | null;
		/**
		 * Callback is called when an option is selected.
		 */
		on_select?: (option: Option) => void;
	}

	export function activate_item_starting_with(value: string | null) {
		if (value)
			activate(normalized_lookup.find(value))
		else
			deactivate()
	}

	export function scroll_to_selected_item() {
		if (selected_item)
			scroll_into_view(selected_item.id);
	}

	let {
		active_item_id = $bindable(null),
		empty_text,
		focusable = true,
		id = $bindable(unique_id()),
		keyboard_capture,
		options,
		options_heading,
		options_label,
		options_value = option => `${option}`,
		value: selected_value = $bindable(null),

		on_select,

		...list_props
	}: SelectList = $props();

	let grouped_items = $derived(
		Object
			.entries(
				Object.groupBy(
					options.map(option => {
						const heading = options_heading?.(option) ?? '';
						const value = options_value?.(option) ?? `${option}`;
						const label = options_label?.(option) ?? value;
						const item_id = `${id}_${hash(heading)}_${hash(value)}`;

						return { option, id: item_id, heading, label, value };
					}),
					item => item.heading
				)
			)
			.map(([heading, items = []]) => ({ heading, items }))
	);
	let sorted_items = $derived(grouped_items.flatMap(({ items }) => items));
	let normalized_lookup = $derived(create_normalized_lookup(sorted_items, item => item.label));
	let active_item = $derived(sorted_items.find(item => item.id === active_item_id));
	let selected_item = $derived(sorted_items.find(item => item.value === selected_value));

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
		if (sorted_items.length === 0)
			return null;

		const current_item = active_item ?? selected_item;
		const current_index = current_item
			? sorted_items.indexOf(current_item)
			: -1;

		return sorted_items[next_index(current_index, sorted_items.length)];
	}


	// Handlers

	function handle_key_down(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				activate_previous_item();
				event.preventDefault();
				break;

			case 'ArrowDown':
				activate_next_item();
				event.preventDefault();
				break;

			case 'Home':
				activate_first_item();
				event.preventDefault();
				break;

			case 'End':
				activate_last_item();
				event.preventDefault();
				break;

			case 'PageDown':
				activate_previous_page();
				event.preventDefault();
				break;

			case 'PageUp':
				activate_next_page();
				event.preventDefault();
				break;

			case 'Escape':
				deactivate();
				break;

			case 'Tab':
				select_active_option();
				break;
		}
	}


	// Activate

	function activate(item: ListItem | null) {
		active_item_id = item && item.id;

		if (active_item_id)
			scroll_into_view(active_item_id);
	}

	function activate_next_item() {
		activate(get_next_item());
	}

	function activate_next_page() {
		// TODO:
	}

	function activate_previous_item() {
		activate(get_previous_item());
	}

	function activate_previous_page() {
		// TODO:
	}

	function activate_first_item() {
		if (sorted_items.length)
			activate(sorted_items[0]);
	}

	function activate_last_item() {
		if (sorted_items.length)
			activate(sorted_items[sorted_items.length - 1]);
	}

	function deactivate() {
		activate(null);
	}


	// Select

	function select(item: ListItem) {
		selected_value = item.value;
		active_item_id = item.id;
		on_select?.(item.option);
	}

	/**
	 * Selects active item if an item is active.
	 * @returns true if an item was selected, otherwise false.
	 */
	export function select_active_option() {
		if (!active_item)
			return false;

		select(active_item);
		return true;
	}

	// https://stackoverflow.com/a/52171480
	function hash(source: string, seed = 0) {
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
</script>

<List
	bind:active_item_id
	{...list_props}
	{focusable}
	{id}
	onkeydown={handle_key_down}
>
	{#each grouped_items as { heading, items }, index (heading)}
		{#if index > 0}
			<ListItemSeparator />
		{/if}

		{#if heading}
			<ListItemHeading>
				{heading}
			</ListItemHeading>
		{/if}

		{#each items as item (item.value)}
			<ListItemOption
				id={item.id}
				current={item.id === active_item_id}
				selected={item.value === selected_value}
				text={item.label}
				on_activate={() => {
					active_item_id = item.id;
				}}
				on_deactivate={() => {
					active_item_id = null;
				}}
				on_select={() => {
					select(item);
				}}
			/>
		{/each}
	{/each}

	{#if grouped_items.length === 0 && empty_text}
		<ListItemText>
			{empty_text}
		</ListItemText>
	{/if}
</List>

<EventHandler
	element={keyboard_capture}
	onkeydown={handle_key_down}
/>
