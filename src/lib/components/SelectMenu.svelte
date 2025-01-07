<script lang="ts" generics="Option">
    import { unique_id } from '../unique_id.js';
    import EventHandler from './EventHandler.svelte';
    import Menu from './Menu.svelte';
    import SelectList from './SelectList.svelte';

	interface SelectMenu {
		/**
		 * Id of the currently activated list item.  
		 * Used to set active descendant in parent controls.
		 */
		active_item_id?: string | null;
		/**
		 * Element to anchor the menu to.  
		 * The menu will be positioned near the anchor and sized to at the least the same width as the anchor.
		 */
		anchor: string | HTMLElement;
		/**
		 * Anchor menu to the right side instead of the left.
		 */
		anchor_right?: boolean;
		/**
		 * Animation to trigger when opening and closing menu.
		 */
		animation?: 'fade' | 'slide';
		/**
		 * Class to apply to the menu element.
		 */
		class?: string;
		/**
		 * A text item will be added with this text if no options exist.
		 */
		empty_text?: string;
		/**
		 * The element id of the menu.
		 */
		id?: string;
		/**
		 * Element to attach navigation keyboard events to.
		 */
		keyboard_capture?: HTMLElement | string;
		list?: ReturnType<typeof SelectList>,
		modal?: boolean;
		/**
		 * Options to display in the menu.
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
		value?: string | null;
		visible?: boolean;
		/**
		 * Callback is called when an option is selected.
		 */
		on_select?: (option: Option) => void;
	}

	let {
		active_item_id = $bindable(null),
		anchor,
		anchor_right,
		animation,
		class: class_menu,
		empty_text,
		id = $bindable(unique_id()),
		keyboard_capture,
		list = $bindable(),
		modal,
		options,
		options_heading,
		options_label,
		options_value,
		value = $bindable(null),
		visible = $bindable(false),

		on_select,
	}: SelectMenu = $props();
	let has_options = $derived(options.length > 0);
</script>

<Menu
	{anchor}
	{anchor_right}
	{animation}
	{id}
	{modal}
	class={class_menu}
	visible={(visible && has_options) || !!empty_text}
	width="anchor"
	on_close={() => {
		visible = false
	}}
	on_open={() => {
		visible = true
		list?.scroll_to_selected_item();
	}}
>
	<SelectList
		bind:this={list}
		bind:active_item_id
		bind:value
		{empty_text}
		{options}
		{options_heading}
		{options_label}
		{options_value}
		focusable={modal}
		keyboard_capture={visible && has_options ? keyboard_capture : undefined}
		on_select={option => {
			visible = false;
			on_select?.(option);
		}}
	/>
</Menu>

<EventHandler
	element={keyboard_capture}
	onkeydown={event => {
		if (visible) {
			switch (event.key) {
				case 'Enter':
					if (list?.select_active_option())
						event.preventDefault();
					break;
			}
		}
		else {
			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowUp':
					visible = true;
					event.preventDefault();
					break;
			}
		}
	}}
/>
