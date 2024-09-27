<script lang="ts">
	import {
	    add_days,
	    add_months,
	    add_weeks,
	    create_date_only,
	    get_calendar_dates,
	    get_calendar_month_text,
	    get_date_today,
	    get_next_period,
	    get_period_for_date,
	    get_previous_period,
	    is_same_date,
	    period_contains_date,
	    week_days_short,
	    type DateOnly,
	    type DateOnlyLike,
	    type PeriodLike
	} from '@tobper/eon';
	import { tick } from 'svelte';
	import { get_optional_button_element } from '../html.js';
	import { unique_id } from '../unique_id.js';
	import Button from './Button.svelte';
	import ChevronLeftIcon from './icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from './icons/ChevronRightIcon.svelte';

	interface Calendar {
		id?: string;
		date?: DateOnlyLike | null;
		period?: PeriodLike | null;
		period_first_day?: number | null;
		on_select?: (new_date: DateOnly) => void;
	}

	export function reset(options: {
		period?: Calendar['period'];
		date?: Calendar['date'];
	}) {
		if (options.period !== undefined)
			selected_period = options.period;

		if (options.date !== undefined)
			selected_date = options.date;

		active_date = selected_date;
	}

	export async function focus() {
		await tick();

		const active_button = active_date && get_optional_button_element(`#${id}_${active_date.key}`);
		(active_button ?? list).focus();
	}

	export function handle_key_down(event: KeyboardEvent) { 
		const handler = key_handlers.get(event.key);
		if (handler) {
			const { key } = event;
			const modifier = event.ctrlKey;

			if (key !== 'Tab' && key !== 'Escape') {
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
		period: selected_period = null,
		date: selected_date = null,
		id = unique_id(),
		on_select,
		...props
	}: Calendar = $props();

	/** Used to determine the start of the period when it is based on a date (active/selected/today) */
	let period_first_day = $derived(selected_period?.first_day.day ?? props.period_first_day ?? 1)

	/** The date currently focused (defaults to selected date) */
	let active_date = $state<DateOnly | null>(null);

	$effect(() => {
		if (!active_date && selected_date)
			activate(selected_date);
	});

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


	// Visible month

	function goto_next_month() {
		selected_period = get_next_period(active_period);
	}

	function goto_previous_month() {
		selected_period = get_previous_period(active_period);
	}


	// Activated date

	function activate(new_date: DateOnlyLike | null) {
		active_date = new_date && create_date_only(new_date);

		if (active_date && !period_contains_date(active_period, active_date))
			selected_period = get_period_for_date(active_date, period_first_day);

		focus();
	}

	function activate_previous_day() {
		activate(active_date ? add_days(active_date, -1) : (active_period_contains_today ? today : active_period.last_day));
	}

	function activate_previous_week() {
		activate(active_date ? add_weeks(active_date, -1) : (active_period_contains_today ? today : active_period.last_day));
	}

	function activate_previous_month() {
		activate(active_date ? add_months(active_date, -1) : (active_period_contains_today ? today : active_period.last_day));
	}

	function activate_next_day() {
		activate(active_date ? add_days(active_date, 1) : (active_period_contains_today ? today : active_period.first_day));
	}

	function activate_next_week() {
		activate(active_date ? add_weeks(active_date, 1) : (active_period_contains_today ? today : active_period.first_day));
	}

	function activate_next_month() {
		activate(active_date ? add_months(active_date, 1) : (active_period_contains_today ? today : active_period.first_day));
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
 
<div class="calendar" {id}>
	<ul
		bind:this={list}
		aria-label="Calendar dates"
		role="listbox"
		onkeydown={handle_key_down}
		tabindex={active_date_visible ? undefined : 0}
	>
		{#each week_days_short as week_day}
			<li role="heading" aria-level="1">
				{week_day}
			</li>
		{/each}

		{#each dates as { same_month, weekend, ...date }}
			{@const date_is_active = !!active_date && is_same_date(date, active_date)}
			{@const date_is_selected = !!selected_date && is_same_date(date, selected_date)}
			{@const date_is_today = is_same_date(date, today)}

			<li
				class:weekend
				class:today={date_is_today}
				role="listitem"
			>
				{#if same_month}
					<Button
						id={`${id}_${date.key}`}
						current={date_is_selected}
						type="plain"
						onclick={() => select_date(date)}
						focusable={date_is_active}
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
