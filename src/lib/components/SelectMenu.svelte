<script lang="ts" generics="Option">
    import { unique_id } from '../unique_id.js';
    import EventHandler from './EventHandler.svelte';
    import Menu from './Menu.svelte';
    import SelectList from './SelectList.svelte';

	interface SelectMenu {
		/**
		 * The id of the currently activated date.  
		 * Used to set active descendant in parent controls.
		 */
		active_item_id?: string | null;
		anchor: string | HTMLElement;
		/**
		 * Extra class to add to the menu.
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
		 * The currently selected option.
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
		value?: string | null;
		trigger?: string | HTMLElement;
		visible?: boolean;
		/**
		 * Callback is called when an option is selected.
		 */
		on_select?: (option: Option) => void;
	}

	let {
		active_item_id = $bindable(null),
		anchor,
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
		trigger,
		visible = $bindable(false),
		on_select,
	}: SelectMenu = $props();
</script>

<Menu
	bind:visible
	{anchor}
	{id}
	{modal}
	{trigger}
	class={class_menu}
	on_open={() => {
		active_item_id = null;
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
		keyboard_capture={visible ? keyboard_capture : undefined}
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

				case 'Escape':
					// Close menu if no option is active
					if (!active_item_id)
						visible = false;
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
