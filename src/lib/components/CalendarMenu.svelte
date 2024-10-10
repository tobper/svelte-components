<script lang="ts">
	import { unique_id } from '$lib/unique_id.js';
	import type { DateOnly } from '@tobper/eon';
	import Calendar from './Calendar.svelte';
	import EventHandler from './EventHandler.svelte';
	import Menu from './Menu.svelte';

	interface CalendarMenu {
		/**
		 * The id of the currently activated date.  
		 * Used to set active descendant in parent controls.
		 */
		active_descendant?: string | null;
		anchor: string | HTMLElement;
		calendar?: ReturnType<typeof Calendar>,
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
		 * The currently selected date.
		 */
		selected_date?: DateOnly | null;
		trigger?: string | HTMLElement;
		visible?: boolean;
		/**
		 * Callback is called when a date is selected.
		 */
		 on_select?: (new_date: DateOnly | null) => void;
	}

	let {
		active_descendant = $bindable(null),
		anchor,
		calendar = $bindable(),
		id = $bindable(unique_id()),
		keyboard_capture,
		modal,
		selected_date = $bindable(null),
		trigger,
		visible = $bindable(false),
		on_select,
	}: CalendarMenu = $props();
</script>

<Menu
	bind:visible
	{anchor}
	{id}
	{modal}
	{trigger}
	on_open={() => {
		calendar?.reset();
	}}
>
	<Calendar
		bind:this={calendar}
		bind:active_descendant
		bind:selected_date
		focusable={modal}
		keyboard_capture={visible ? keyboard_capture : undefined}
		on_select={new_date => {
			visible = false;
			on_select?.(new_date);
		}}
	/>
</Menu>

<EventHandler
	element={keyboard_capture}
	onkeydown={event => {
		if (visible) {
			switch (event.key) {
				case 'Escape':
					console.log('active_descendant', active_descendant)
					// Close menu if no date is active
					if (!active_descendant)
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
