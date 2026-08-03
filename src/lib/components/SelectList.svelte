<script lang="ts" generics="T">
	import { create_list_items, find_options, map_list_options, type ListItem, type Option } from '$lib/internal';
	import { create_normalized_lookup } from '$lib/normalization';
	import { type Component, type ComponentProps, type Snippet } from 'svelte';
	import type { ClassValue, HTMLColAttributes } from 'svelte/elements';
	import { list_navigation, on_resize, virtualized_list } from '../attachments';
	import { handle_keyboard_event, on, scroll_into_view, type ElementReference } from '../html.js';
	import { unique_id } from '../unique_id.js';
	import List from './List.svelte';
	import ListItemHeading from './ListItemHeading.svelte';
	import ListItemOption from './ListItemOption.svelte';
	import ListItemSeparator from './ListItemSeparator.svelte';
	import ListItemText from './ListItemText.svelte';
	import { set_list_context } from './list_context';

	type ListItemOptionProps = ComponentProps<typeof ListItemOption>;

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
		 * A text item will be added with this text if no options exist.
		 */
		empty_text?: string;
		/**
		 * Filter provided options with text
		 */
		filter?: string;
		/**
		 * The element id of the list.
		 */
		id?: string;
		/**
		 * A list controlled by another element can not receive focus by itself
		 * and list navigation events will the attached to the controlling element.
		 */
		controlled_by?: ElementReference;
		/**
		 * Options to display in the list.
		 */
		options: T[];
		/**
		 * Callback that is called for each option to determine the value of the option.
		 * @default Option is converted to a string.
		 */
		option_value?: (option: T) => string;
		/**
		 * Callback that is called for each option to determine the heading of the option.
		 * @default No header is displayed.
		 */
		option_heading?: (option: T) => string | undefined;
		/**
		 * ...
		 */
		option_icon?: (option: T) => Component | Snippet;
		/**
		 * Callback that is called for each option to determine the kbd of the option.
		 * @default No kbd is displayed.
		 */
		option_kbd?: (option: T) => string | string[] | undefined;
		/**
		 * ...
		 */
		option_details?: (option: T) => string | undefined;
		/**
		 * Callback that is called for each option to determine the children of the option.
		 */
		option_children?: (option: T) => T[] | undefined;
		/**
		 * The value of the option currently selected.
		 */
		value?: string | null;
		/**
		 * The transition to apply to items.
		 */
		transition?: ListItemOptionProps['transition'];
		/**
		 * ...
		 */
		virtualized?:
			| boolean
			| {
				item_height?: (option: T) => number | undefined
			}
		/**
		 * Callback is called when an option is activated.
		 */
		on_activate?: (option: T, value: string) => void;
		/**
		 * Callback is called when an option is deactivated.
		 */
		on_deactivate?: () => void;
		/**
		 * Callback is called when an option is selected.
		 */
		on_select?: (option: T, value: string) => void;

		/**
		 * ...
		 */
		content?: Snippet<[T]>;
		/**
		 * ...
		 */
		icon?: Snippet<[T]>;
		/**
		 * ...
		 */
		details?: Snippet<[T]>;
		/**
		 * ...
		 */
		templates?: Snippet;
	}

	export function activate_first_item() {
		navigation.activate_first_item();
	}

	export function activate_last_item() {
		navigation.activate_last_item();
	}

	export function activate_item_starting_with(prefix: string) {
		const item = prefix
			? option_items_lookup.find(prefix)
			: undefined;

		if (!item) {
			active_item_id = null;
			return;
		}

		const { id, value, option } = item;

		active_item_id = id;

		return { id, value, option };
	}

	export function find_item(value: string) {
		const item = option_items.find(option => option.value === value);
		if (!item)
			return undefined;

		const { option } = item;
		return { value, option };
	}

	export function select_active_item() {
		if (!active_item)
			return false;

		select(active_item);
		return true;
	}

	export function scroll_to_selected_item() {
		const can_scroll =
			selected_item &&
			list_element &&
			list_element.scrollHeight > list_element.clientHeight;

		if (can_scroll)
			scroll_into_view(selected_item.id, 'nearest', 'smooth');
	}

	let {
		active_item_id = $bindable(null),
		empty_text,
		filter,
		id = $bindable(unique_id()),
		controlled_by,
		options,
		option_value,
		option_heading,
		option_icon,
		option_kbd,
		option_details,
		option_children,
		value: selected_value = $bindable(null),
		transition,
		virtualized,

		on_activate,
		on_deactivate,
		on_select,

		content,
		icon,
		details,
		templates,

		...list_props
	}: SelectList = $props();
	let list_element = $state<HTMLElement>()

	set_list_context({
		get focusable() { return !controlled_by }
	});

	const [
		/** All provided options mapped using provided callbacks. */
		mapped_options,
	 	mapped_options_count
	] = $derived(
		map_list_options(
			id,
			options,
			option_value,
			option_heading,
			option_icon,
			option_kbd,
			option_details,
			option_children,
		)
	);
	/** Mapped options filtered by provided filter text. */
	const filtered_options = $derived(
		filter && mapped_options_count > 5
			? find_options(mapped_options, filter)
			: mapped_options
	);
	/** List items converted from filtered mapped options. */
	const filtered_list_items = $derived(
		create_list_items(filtered_options, empty_text)
	);
	/** List items of type option. */
	const option_items = $derived(
		filtered_list_items.filter(item => item.type === 'option')
	);
	/** Lookup of option list items used for activation. */
	const option_items_lookup = $derived(
		create_normalized_lookup(option_items, item => item.value)
	);
	const navigation = list_navigation({ on_activate: activate });
	const default_item_heights = $state({
		heading: 0,
		option: 0,
		option_with_details: 0,
		separator: 0,
		text: 0,
	});

	const virtualize = $derived.by(() => {
		if (!virtualized)
			return;

		const defaults = default_item_heights;
		const option_item_height = virtualized !== true
			? virtualized.item_height
			: undefined;

		const item_height = (item: ListItem<T>) => {
			const height = item.type === 'option'
				? option_item_height?.(item.option)
				: undefined;

			if (height)
				return height;

			if (item.type === 'option' && item.details)
				return defaults.option_with_details;

			return defaults[item.type];
		}

		return virtualized_list(
			() => filtered_list_items,
			() => selected_value,
			item_height
		);
	});
	const visible_items = $derived(
		virtualize?.list_items ?? filtered_list_items
	);
	const active_item = $derived(
		active_item_id && (option_items.find(item => item.id === active_item_id) ?? null)
	);
	const selected_item = $derived(
		selected_value && (option_items.find(item => item.value === selected_value) ?? null)
	);

	// Activate, Deactivate
	function activate(item_id: string) {
		if (active_item_id === item_id)
			return;

		active_item_id = item_id;

		if (active_item) {
			if (on_activate) {
				const { option, value } = active_item;
				on_activate(option, value);
			}
		}
		else
			// This shouldn't happen, but will if trying to activate an id that doesn't exist
			active_item_id = null;
	}

	function deactivate() {
		if (selected_item) {
			if (active_item_id !== selected_item.id) {
				activate(selected_item.id);
			}
		}
		else if (active_item_id !== null) {
			active_item_id = null;
			on_deactivate?.();
		}
	}


	// Select

	function select(item: Option<T>) {
		activate(item.id)

		selected_value = item.value;

		if (on_select) {
			const { option, value } = item;
			on_select(option, value);
		}
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

	$effect(() => {
		if (controlled_by)
			return navigation.controller(controlled_by);
	});
</script>

<List
	{...list_props}
	{active_item_id}
	bind:id
	bind:element={list_element}
	focusable={!controlled_by}
	{@attach navigation.handlers}
	{@attach virtualize?.handlers}
	{@attach !controlled_by && on({
		keydown: handle_keyboard_event('allow_default', {
			'Escape': () => {
				deactivate();
				scroll_to_selected_item();
			},
			'Tab': select_active_option,
		})
	})}
>
	{#each visible_items as item (item.id)}
		{#if item.type === 'heading'}
			<ListItemHeading
				indent={item.indent}
				label={item.label}
				{@attach item.handlers}
			/>
		{:else if item.type === 'separator'}
			<ListItemSeparator
				indent={item.indent}
				{@attach item.handlers}
			/>
		{:else if item.type === 'text'}
			<ListItemText
				indent={item.indent}
				{@attach item.handlers}
			>
				{item.text}
			</ListItemText>
		{:else}
			<ListItemOption
				id={item.id}
				indent={item.indent}
				current={item.id === active_item_id}
				selected={item.value != undefined && item.value === selected_value}
				content={content && option_content}
				icon={icon && option_icon || item.icon}
				kbd={item.kbd}
				details={details && option_details || item.details}
				label={item.value}
				transition={transition}
				on_activate={() => {
					activate(item.id)
					// active_item_id = item.id;
				}}
				on_deactivate={() => {
					if (active_item_id === item.id)
						deactivate();
						// active_item_id = null;
				}}
				on_select={() => {
					select(item);
				}}
				{@attach item.handlers}
			/>

			{#snippet option_details()}
				{@render details?.(item.option)}
			{/snippet}

			{#snippet option_content()}
				{@render content?.(item.option)}
			{/snippet}

			{#snippet option_icon()}
				{@render icon?.(item.option)}
			{/snippet}
		{/if}
	{/each}
</List>

<ol class="templates" {@attach element => {
	document.body.appendChild(element);
}}>
	<div {@attach on_resize(({ height }) => default_item_heights.heading = height)}>
		<ListItemHeading label="x" />
	</div>
	<div {@attach on_resize(({ height }) => default_item_heights.option = height)}>
		<ListItemOption label="x" />
	</div>
	<div {@attach on_resize(({ height }) => default_item_heights.option_with_details = height)}>
		<ListItemOption label="x" details="x" />
	</div>
	<div {@attach on_resize(({ height }) => default_item_heights.separator = height)}>
		<ListItemSeparator />
	</div>
	<div {@attach on_resize(({ height }) => default_item_heights.text = height)}>
		<ListItemText>x</ListItemText>
	</div>
	{#if templates}
		{@render templates()}
	{/if}
</ol>

<style>
	.templates {
		position: fixed;
		visibility: hidden;
		pointer-events: none;
		right: 0;
		top: 0;
	}
</style>
