<script lang="ts">
	import {
	    add_days,
	    add_months,
	    add_weeks,
	    get_calendar_dates,
	    get_calendar_month_text,
	    get_date_only_key,
	    get_date_today,
	    get_next_period,
	    get_period_for_date,
	    get_previous_period,
	    is_same_date,
	    period_contains_date,
	    week_days_short,
	    type DateOnly,
	    type Period
	} from '@tobper/eon';
	import { tick, untrack } from 'svelte';
	import { classes } from '../classes.js';
	import { unique_id } from '../unique_id.js';
	import Button from './Button.svelte';
	import EventHandler from './EventHandler.svelte';
	import ChevronLeftIcon from './icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from './icons/ChevronRightIcon.svelte';
	import List from './List.svelte';
	import ListItemHeading from './ListItemHeading.svelte';
	import ListItemOption from './ListItemOption.svelte';
	import ListItemText from './ListItemText.svelte';

	interface Calendar {
		/**
		 * The element id of the list.
		 */
		id?: string;
		/**
		 * Id of the currently activated date.  
		 * Used to set active descendant in parent controls.
		 */
		active_item_id?: string | null;
		/**
		 * Class to apply to the calendar element.
		 */
		class?: string;
		/**
		 * Determines if it should be possible to tab to the list.  
		 * Set this to false when displayed in combobox menus.
		 */
		focusable?: boolean;
		/**
		 * Element to attach navigation keyboard events to.
		 */
		keyboard_capture?: HTMLElement | string;
		/**
		 * The period currently being displayed.
		 */
		period?: Period | null;
		/**
		 * The currently selected date.
		 */
		selected_date?: DateOnly | null;
		/**
		 * Callback is called when a date is selected.
		 */
		on_select?: (new_date: DateOnly) => void;
	}

	const today = get_date_today();

	let {
		id = $bindable(unique_id()),
		active_item_id = $bindable(null),
		focusable = true,
		keyboard_capture,
		selected_date = $bindable(null),

		on_select,

		...props
	}: Calendar = $props();

	/** The date currently highlighted */
	let active_date = $state(selected_date);

	/** The period currently being displayed */
	let active_period = $state(props.period ?? get_period_for_date(selected_date ?? today, 1));

	/** Used to determine the start of the period when it is based on a date (active/selected/today) */
	let period_first_day = $derived(active_period.first_day.day);

	/** Active period contains today */
	let active_period_contains_today = $derived(period_contains_date(active_period, today));

	/** Dates to display */
	let dates = $derived(get_calendar_dates(active_period));

	/** Text to display in the header */
	let header = $derived(get_calendar_month_text(active_period));

	// Update active period and deactivate date when selected date is updated
	$effect.pre(() => {
		const date = selected_date;

		untrack(() => {
			deactivate();
			activate_period(date)
		});
	});

	// Update active period when active date is updated
	$effect.pre(() => {
		const date = active_date;

		untrack(() => {
			activate_period(date)
		});
	});

	function get_item_id(date: DateOnly) {
		const key = get_date_only_key(date);

		return `${id}_${key}`;
	}

	function handle_key_down(event: KeyboardEvent) { 
		const modifier = event.ctrlKey;

		switch (event.key) {
			case 'ArrowLeft':
				if (modifier)
					activate_previous_month();
				else
					activate_previous_day();
				event.preventDefault();
				break;

			case 'ArrowRight':
				if (modifier)
					activate_next_month();
				else
					activate_next_day();
				event.preventDefault();
				break;

			case 'ArrowUp':
				if (modifier)
					activate_previous_month();
				else
					activate_previous_week();
				event.preventDefault();
				break;

			case 'ArrowDown':
				if (modifier)
					activate_next_month();
				else
					activate_next_week();
				event.preventDefault();
				break;

			case 'Home':
				activate_first_of_month();
				event.preventDefault();
				break;

			case 'End':
				activate_last_of_month();
				event.preventDefault();
				break;

			case 'Escape':
				deactivate();
				break;

			case 'Tab':
				select_active_date();
				break;
		}
	}


	// Visible month

	function goto_next_month() {
		active_period = get_next_period(active_period);
	}

	function goto_previous_month() {
		active_period = get_previous_period(active_period);
	}


	// Activated date

	function activate_period(date: DateOnly | null) {
		if (date)
			active_period = get_period_for_date(date, period_first_day);
	}

	export async function activate(new_date: DateOnly | null) {
		// Allow new period to be rendered before activating list item
		if (new_date && !period_contains_date(active_period, new_date))
			await tick();

		active_date = new_date;
		active_item_id = active_date && get_item_id(active_date);
	}

	function activate_previous_day() {
		const base_date = active_date ?? selected_date;
		activate(base_date ? add_days(base_date, -1) : (active_period_contains_today ? today : active_period.last_day));
	}

	function activate_previous_week() {
		const base_date = active_date ?? selected_date;
		activate(base_date ? add_weeks(base_date, -1) : (active_period_contains_today ? today : active_period.last_day));
	}

	function activate_previous_month() {
		const base_date = active_date ?? selected_date;
		activate(base_date ? add_months(base_date, -1) : (active_period_contains_today ? today : active_period.last_day));
	}

	function activate_next_day() {
		const base_date = active_date ?? selected_date;
		activate(base_date ? add_days(base_date, 1) : (active_period_contains_today ? today : active_period.first_day));
	}

	function activate_next_week() {
		const base_date = active_date ?? selected_date;
		activate(base_date ? add_weeks(base_date, 1) : (active_period_contains_today ? today : active_period.first_day));
	}

	function activate_next_month() {
		const base_date = active_date ?? selected_date;
		activate(base_date ? add_months(base_date, 1) : (active_period_contains_today ? today : active_period.first_day));
	}

	function activate_first_of_month() {
		activate(active_period.first_day);
	}

	function activate_last_of_month() {
		activate(active_period.last_day);
	}

	function deactivate() {
		activate(null);
	}

	// Selected date

	/**
	 * Selects active date.
	 * 
	 * @returns true if a date was active; otherwise false.
	 */
	export function select_active_date() {
		if (!active_date)
			return false;

		select_date(active_date);
		return true;
	}
	
	function select_date(date_to_select: DateOnly) {
		selected_date = date_to_select;
		activate(date_to_select);
		on_select?.(selected_date);
	}
</script>
 
<div
	class={classes('calendar variant-primary', props.class)}
	{id}
>
	<header>
		{header}

		<div class="button-group">
			<Button
				{focusable}
				onclick={goto_previous_month}
				small
				title="Previous month"
				type="outlined"
			>
				{#snippet icon()}
					<ChevronLeftIcon />
				{/snippet}
			</Button>
			<Button
				{focusable}
				onclick={goto_next_month}
				small
				title="Next month"
				type="outlined"
			>
				{#snippet icon()}
					<ChevronRightIcon />
				{/snippet}
			</Button>
		</div>
	</header>

	<List
		bind:active_item_id
		{focusable}
		aria_label="Calendar dates"
		onkeydown={handle_key_down}
	>
		{#each week_days_short as week_day}
			<ListItemHeading>
				{week_day}
			</ListItemHeading>
		{/each}

		{#each dates as { same_month, weekend, ...date }}
			{#if same_month}
				{@const date_is_active = !!active_date && is_same_date(date, active_date)}
				{@const date_is_selected = !!selected_date && is_same_date(date, selected_date)}
				{@const date_is_today = same_month && is_same_date(date, today)}
				{@const item_id = get_item_id(date)}

				<ListItemOption
					id={item_id}
					class={classes({ today: date_is_today })}
					contrast={weekend}
					current={date_is_active}
					selected={date_is_selected}
					text={`${date.day}`}
					on_activate={() =>
						activate(date)
					}
					on_deactivate={() =>
						deactivate()
					}
					on_select={() =>
						select_date(date)
					}
				/>
			{:else}
				<ListItemText>
					{date.day}
				</ListItemText>
			{/if}
		{/each}
	</List>
</div>

<EventHandler
	element={keyboard_capture}
	onkeydown={handle_key_down}
/>
