<script lang="ts">
	import type { DateOnly, Period } from '@tobper/eon';
	import { device } from '../device.js';
	import { unique_id } from '../unique_id.js';
	import Calendar from './Calendar.svelte';
	import EventHandler from './EventHandler.svelte';
	import Menu from './Menu.svelte';

	interface CalendarMenu {
		/**
		 * Id of the currently activated date.  
		 * Used to set active descendant in parent controls.
		 */
		active_item_id?: string | null;
		anchor: string | HTMLElement;
		calendar?: ReturnType<typeof Calendar>,
		/**
		 * Class to apply to the menu element.
		 */
		class?: string;
		element?: HTMLElement;
		/**
		 * The element id of the menu.
		 */
		id?: string;
		/**
		 * Element to attach navigation keyboard events to.
		 */
		keyboard_capture?: HTMLElement | string;
		modal?: boolean;
		/**
		 * The period currently being displayed.
		 */
		period?: Period | null;
		/**
		 * The currently selected date.
		 */
		selected_date?: DateOnly | null;
		visible?: boolean;
		/**
		 * Callback is called when a date is selected.
		 */
		 on_select?: (new_date: DateOnly) => void;
	}

	let {
		active_item_id = $bindable(null),
		anchor,
		calendar = $bindable(),
		class: class_menu,
		element = $bindable(),
		id = $bindable(unique_id()),
		keyboard_capture,
		modal,
		period,
		selected_date = $bindable(null),
		visible = $bindable(false),

		on_select,
	}: CalendarMenu = $props();
</script>

<Menu
	bind:element
	bind:visible
	{anchor}
	{id}
	{modal}
	class={class_menu}
	width={device.mobile ? 'anchor' : 'content'}
>
	<Calendar
		bind:this={calendar}
		bind:active_item_id
		bind:selected_date
		focusable={modal}
		keyboard_capture={visible ? keyboard_capture : undefined}
		{period}
		{on_select}
	/>
</Menu>

<EventHandler
	element={keyboard_capture}
	onkeydown={event => {
		if (visible) {
			switch (event.key) {
				case 'Enter':
					if (calendar?.select_active_date())
						event.preventDefault();
					break;

				case 'Escape':
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
