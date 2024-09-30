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
	import ChevronLeftIcon from './icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from './icons/ChevronRightIcon.svelte';

	interface Calendar {
		id?: string;
		/** The date currently focused (defaults to selected date) */
		active_id?: string | null;
		active_date?: DateOnly | null;
		class?: string;
		/* Determines if buttons should be focusable when tabbing. */
		focusable?: boolean;
		period?: Period | null;
		period_first_day?: number | null;
		selected_date?: DateOnly | null;
		on_select?: (new_date: DateOnly) => void;
	}

	export function reset(options: {
		period?: Calendar['period'];
		selected_date?: Calendar['selected_date'];
	}) {
		if (options.period !== undefined)
			selected_period = options.period;

		if (options.selected_date !== undefined)
			selected_date = options.selected_date;

		active_date = selected_date;
	}

	export async function focus() {
		if (!focusable)
			return;

		await tick();

		const button_id = active_date && get_button_id(active_date);
		const active_button = button_id && get_optional_button_element(`#${button_id}`);

		if (active_button)
			active_button.focus();
		else
			list.focus();
	}

	export function handle_key_down(event: KeyboardEvent) { 
		const handler = key_handlers.get(event.key);
		if (handler) {
			const { key } = event;
			const modifier = event.ctrlKey;

			if (key !== 'Escape') {
				event.stopPropagation();
				event.preventDefault();
			}
	
			handler(modifier);
		}
	}

	const today = get_date_today();

	const key_handlers = new Map<string, (modifier: boolean) => void>([
	  ['ArrowLeft', modifier => modifier ? activate_previous_month() : activate_previous_day()],
	  ['ArrowRight', modifier => modifier ? activate_next_month() : activate_next_day()],
	  ['ArrowUp', modifier => modifier ? activate_previous_month() : activate_previous_week()],
	  ['ArrowDown', modifier => modifier ? activate_next_month() : activate_next_week()],
	  ['Home', () => activate_first_of_month()],
	  ['End', () => activate_last_of_month()],
	  ['Enter', () => select_active_date()],
	  [' ', () => select_active_date()],
	]);

	let {
		id = $bindable(unique_id()),
		active_id = $bindable<string | null>(null),
		active_date = $bindable<DateOnly | null>(null),
		class: calendar_class,
		focusable = true,
		period: selected_period = null,
		selected_date = null,
		on_select,
		...props
	}: Calendar = $props();

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

	/** Current period contains the active date */
	let active_date_visible = $derived(!!active_date && period_contains_date(active_period, active_date));

	let list: HTMLElement;

	function get_button_id(date: DateOnly) {
		const key = get_date_only_key(date);

		return `${id}_${key}`;
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
		active_id = active_date && get_button_id(active_date);

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

	// Selected date
	
	function select_date(date_to_select: DateOnly) {
		selected_date = date_to_select;
		activate(date_to_select);
		on_select?.(date_to_select);
	}

	function select_active_date() {
		if (active_date)
			select_date(active_date);
	}
</script>
 
<div
	class={classes('calendar variant-primary', calendar_class)}
	{id}
>
	<ul
		bind:this={list}
		aria-label="Calendar dates"
		role="listbox"
		onkeydown={handle_key_down}
		tabindex={focusable && !active_date_visible ? 0 : undefined}
	>
		{#each week_days_short as week_day}
			<li role="heading" aria-level="1">
				{week_day}
			</li>
		{/each}

		{#each dates as { same_month, weekend, ...date }}
			{@const date_is_active = !!active_date && is_same_date(date, active_date)}
			{@const date_is_selected = !!selected_date && is_same_date(date, selected_date)}
			{@const date_is_today = same_month && is_same_date(date, today)}
			{@const button_id = get_button_id(date)}

			<li
				class:weekend
				class:today={date_is_today}
				role="listitem"
		>
				{#if same_month}
					<Button
						id={button_id}
						active={!focusable && date_is_active}
						current={date_is_selected}
						type="plain"
						onclick={() => select_date(date)}
						focusable={focusable && date_is_active}
						text={date.day}
					/>
				{:else}
					{date.day}
				{/if}
			</li>
		{/each}
	</ul>

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
