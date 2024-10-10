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
	import { tick } from 'svelte';
	import { classes } from '../classes.js';
	import { get_optional_button_element } from '../html.js';
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
		 * The id of the currently activated date.  
		 * Used to set active descendant in parent controls.
		 */
		active_descendant?: string | null;
		/**
		 * Extra class to add to the calendar.
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
		 * The first day of the period. 
		 * @default The first day of specified period or 1 if no period is specified.
		 */
		period_first_day?: number | null;
		/**
		 * The currently selected date.
		 */
		selected_date?: DateOnly | null;
		/**
		 * Callback is called when a date is selected.
		 */
		on_select?: (new_date: DateOnly | null) => void;
	}

	export function reset(options?: {
		period?: Calendar['period'];
		selected_date?: Calendar['selected_date'];
	}) {
		if (options?.period !== undefined)
			selected_period = options.period;

		if (options?.selected_date !== undefined)
			selected_date = options.selected_date;

		active_date = selected_date;
	}

	export async function focus() {
		if (!focusable)
			return;

		// Allow possible new period to be rendered first
		await tick();

		const active_button = active_descendant
			? get_optional_button_element(`#${active_descendant} > button`)
			: null;

		if (active_button)
			active_button.focus();
		else
			list.focus();
	}

	const today = get_date_today();

	let {
		id = $bindable(unique_id()),
		active_descendant = $bindable(null),
		class: calendar_class,
		focusable = true,
		keyboard_capture,
		period: selected_period = null,
		selected_date = $bindable(null),
		on_select,
		...props
	}: Calendar = $props();

	let active_date = $state<DateOnly | null>(null);

	/** Used to determine the start of the period when it is based on a date (active/selected/today) */
	let period_first_day = $derived(selected_period?.first_day.day ?? props.period_first_day ?? 1)

	/** The period currently being displayed */
	let active_period = $derived(
		selected_period || get_period_for_date(active_date || selected_date || today, period_first_day)
	);

	/** Active period contains today */
	let active_period_contains_today = $derived(period_contains_date(active_period, today));

	/** Dates to display */
	let dates = $derived(get_calendar_dates(active_period));

	/** Text to display in the header */
	let header = $derived(get_calendar_month_text(active_period));

	let list: ReturnType<typeof List>;

	function get_item_id(date: DateOnly) {
		const key = get_date_only_key(date);

		return `${id}_${key}`;
	}


	// Handlers

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

			case 'Enter':
				if (!focusable) {
					select_active_date();
					event.preventDefault();
				}
				break;

			case 'Escape':
				if (active_descendant) {
					deactivate();
					event.preventDefault();
					event.stopPropagation();
				}
				break;

			case 'Tab':
				select_active_date();
				break;
		}
	}


	// Visible month

	function goto_next_month() {
		selected_period = get_next_period(active_period);
	}

	function goto_previous_month() {
		selected_period = get_previous_period(active_period);
	}


	// Activated date

	function activate(new_date: DateOnly | null) {
		active_date = new_date;
		active_descendant = active_date && get_item_id(active_date);

		if (active_date && !period_contains_date(active_period, active_date))
			selected_period = get_period_for_date(active_date, period_first_day);

		focus();
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
	
	function select_date(date_to_select: DateOnly | null) {
		selected_date = date_to_select;
		activate(date_to_select);
		on_select?.(date_to_select);
	}

	function select_active_date() {
		select_date(active_date);
	}
</script>
 
<div
	class={classes('calendar variant-primary', calendar_class)}
	{id}
>
	<List
		bind:this={list}
		{active_descendant}
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
					onclick={() =>
						select_date(date)
					}
				>
					{date.day}
				</ListItemOption>
			{:else}
				<ListItemText>
					{date.day}
				</ListItemText>
			{/if}
		{/each}
	</List>

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
</div>

<EventHandler
	element={keyboard_capture}
	onkeydown={handle_key_down}
/>
