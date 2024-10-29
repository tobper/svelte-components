<script lang="ts" generics="Option">
	import type { HTMLColAttributes } from 'svelte/elements';
	import { get_optional_button_element, scroll_into_view } from '../html.js';
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
		 * The id of the currently activated item.  
		 * Used to set active descendant in parent controls.
		 */
		active_descendant?: string | null;
		/**
		 * A string value that labels the interactive list.
		 */
		aria_label?: HTMLColAttributes['aria-label'];
		/**
		 * Extra class to add to the list.
		 */
		class?: string;
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
		 * Callback is called for each option to determine the label of the option.
		 * @default No header
		 */
		options_heading?: (option: Option) => string;
		/**
		 * Callback is called for each option to determine the label of the option.
		 * @default Same as value.
		 */
		options_label?: (option: Option) => string;
		/**
		 * Callback is called for each option to determine the value of the option.
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

	export function activate_item_starting_with(value: string) {
		const item = normalized_lookup.find(value) ?? null;
		activate(item);
	}

	let {
		active_descendant = $bindable(null),
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

	let list: ReturnType<typeof List>;
	let grouped_items = $derived(
		Object
			.entries(
				Object.groupBy(
					options.map(option => {
						const value = options_value?.(option) ?? `${option}`;
						const label = options_label?.(option) ?? value;
						const item_id = `${id}_${hash(label)}`;

						return { option, id: item_id, label, value };
					}),
					({ option }) => options_heading?.(option) ?? ''
				)
			)
			.map(([heading, items = []]) => ({ heading, items }))
	);
	let sorted_items = $derived(grouped_items.flatMap(({ items }) => items));
	let normalized_lookup = $derived(create_normalized_lookup(sorted_items, item => item.label));

	async function focus_relevant_element() {
		if (!focusable)
			return;

		const active_button = active_descendant
			? get_optional_button_element(`#${active_descendant} > button`)
			: null;

		if (active_button)
			active_button.focus();
		else
			list.focus();
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

	function get_current_item() {
		if (sorted_items.length === 0)
			return null;

		if (active_descendant)
			return sorted_items.findIndex(item => item.id === active_descendant);
		else if (selected_value)
			return sorted_items.findIndex(item => item.value === selected_value);
		else
			return -1;
	}

	function get_item(next_index: (current: number, length: number) => number) {
		const current = get_current_item();
		if (current === null)
			return null;

		return sorted_items[next_index(current, sorted_items.length)];
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
				if (active_descendant) {
					deactivate();
					event.preventDefault();
					event.stopPropagation();
				}
				break;

			case 'Tab':
				select_active_option();
				break;
		}
	}


	// Activate

	function activate(item: ListItem | null) {
		active_descendant = item ? item.id : null;
		focus_relevant_element();

		if (active_descendant)
			scroll_into_view(active_descendant);
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
		on_select?.(item.option);
	}

	export function select_active_option() {
		const item =
			active_descendant &&
			sorted_items.find(item => item.id === active_descendant);

		if (!item)
			return false;

		select(item);
		return true;
	}

	// https://stackoverflow.com/a/52171480
	function hash(value: string, seed = 0) {
		let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
		for(let i = 0, ch; i < value.length; i++) {
			ch = value.charCodeAt(i);
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
	bind:this={list}
	{...list_props}
	{active_descendant}
	{focusable}
	{id}
	onkeydown={handle_key_down}
>
	{#each grouped_items as { heading, items }, i}
		{#if i > 0}
			<ListItemSeparator />
		{/if}

		{#if heading}
			<ListItemHeading>
				{heading}
			</ListItemHeading>
		{/if}

		{#each items as item}
			<ListItemOption
				id={item.id}
				current={item.id === active_descendant}
				selected={item.value === selected_value}
				onclick={() => {
					active_descendant = item.id;
					select(item);
				}}
			>
				{item.label}
			</ListItemOption>
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
