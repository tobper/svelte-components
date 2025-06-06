<script lang="ts">
	import type { ElementReference } from '$lib/html.js';
	import type { DateOnly, Period } from '@tobper/eon';
	import type { ClassValue } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import { anchor } from './anchor.js';
	import Calendar from './Calendar.svelte';
	import EventHandler from './EventHandler.svelte';
	import { popover } from './popover.js';

	interface CalendarMenu {
		/**
		 * Id of the currently activated date.  
		 * Used to set active descendant in parent controls.
		 */
		active_item_id?: string | null;
		/**
		 * The reference to the element that is controlling the calendar.
		 */
		anchored_to?: ElementReference;
		calendar?: ReturnType<typeof Calendar>,
		calendar_id?: string;
		/**
		 * Class to apply to the menu element.
		 */
		class?: ClassValue;
		/**
		 * The reference to the element that is controlling the calendar.
		 */
		controlled_by: ElementReference;
		/**
		 * The currently selected date.
		 */
		date?: DateOnly | null;
		/**
		 * The element id of the menu.
		 */
		id?: string;
		modal?: boolean;
		/**
		 * The period currently being displayed.
		 */
		period?: Period | null;
		visible?: boolean;
		/**
		 * Callback is called when a date is selected.
		 */
		 on_select?: (new_date: DateOnly) => void;
	}

	let {
		active_item_id = $bindable(null),
		anchored_to,
		calendar = $bindable(),
		calendar_id = $bindable(unique_id()),
		class: class_menu,
		controlled_by,
		id = $bindable(unique_id()),
		modal,
		period,
		date = $bindable(null),
		visible = $bindable(false),

		on_select,
	}: CalendarMenu = $props();
</script>

<div
	use:anchor={{
		anchor: anchored_to ?? controlled_by,
		match_width: true,
	}}
	use:popover={{
		animation: 'fade',
		modal,
		visible,
	}}
	popover="auto"
>
	<div
		{id}
		class={['menu', class_menu]}
		role="menu"
		tabindex="-1"
	>
		<Calendar
			bind:this={calendar}
			bind:active_item_id
			bind:date
			bind:id={calendar_id}
			{period}
			controlled_by={visible ? controlled_by : undefined}
			on_select={new_date => {
				visible = false;
				on_select?.(new_date);
			}}
		/>
	</div>
</div>

<EventHandler
	element={controlled_by}
	onkeydown={event => {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				if (!visible) {
					event.preventDefault();
					visible = true;
				}
				break;

			case 'Enter':
				if (visible && calendar?.select_active_date())
					event.preventDefault();
				break;


			case 'Escape':
				event.preventDefault();
				visible = false;
				break;
		}
	}}
/>

