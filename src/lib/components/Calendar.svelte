<script lang="ts">
	import { type ElementReference } from '$lib/html.js';
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
	    to_date,
	    week_days_short,
	    type DateOnly,
	    type Period
	} from '@tobper/eon';
	import { tick, untrack } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import EventHandler from './EventHandler.svelte';
	import ChevronLeftIcon from './icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from './icons/ChevronRightIcon.svelte';

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
		class?: ClassValue;
		/**
		 * A calendar controller by another element cannot receive focus and
		 * keyboard handlers for navigation are attached to the controlling element.
		 */
		controlled_by?: ElementReference;
		/**
		 * The period currently being displayed.
		 */
		period?: Period | null;
		/**
		 * The currently selected date.
		 */
		date?: DateOnly | null;
		/**
		 * Callback is called when a date is selected.
		 */
		on_select?: (new_date: DateOnly) => void;
	}

	const aria_label_format: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
	const today = get_date_today();

	let {
		id = $bindable(unique_id()),
		active_item_id = $bindable(null),
		controlled_by,
		date: selected_date = $bindable(null),

		on_select,

		...props
	}: Calendar = $props();

	let listbox_element = $state<HTMLElement>();

	/** The date currently highlighted */
	let active_date = $state<DateOnly | null>(null);

	/** The period currently being displayed */
	let active_period = $state(props.period ?? get_period_for_date(selected_date ?? today, 1));

	const active_period_contains_today = $derived(period_contains_date(active_period, today));
	const can_focus = $derived(!controlled_by);
	const header_text = $derived(get_calendar_month_text(active_period));
	const visible_dates = $derived(
		get_calendar_dates(active_period)
			.map(date => ({
				...date,
				element_id: get_item_id(date),
				is_active: !!active_date && is_same_date(date, active_date),
				is_selected: !!selected_date && is_same_date(date, selected_date),
				is_today: date.same_month && is_same_date(date, today),
			}))
	);

	// Update active date and period when selected date is updated
	$effect.pre(() => {
		const date = selected_date;

		untrack(() => {
			activate(date);
			goto_period_for_date(date)
		});
	});

	function get_item_id(date: DateOnly) {
		const key = get_date_only_key(date);

		return `${id}_${key}`;
	}

	function handle_key_down(event: KeyboardEvent) { 
		const { key, ctrlKey } = event;

		switch (key) {
			case 'ArrowLeft':
				event.preventDefault();

				if (ctrlKey)
					activate_previous_month();
				else
					activate_previous_day();

				goto_period_for_date(active_date);
				break;

			case 'ArrowRight':
				event.preventDefault();

				if (ctrlKey)
					activate_next_month();
				else
					activate_next_day();

				goto_period_for_date(active_date);
				break;

			case 'ArrowUp':
				event.preventDefault();

				if (ctrlKey)
					activate_previous_month();
				else
					activate_previous_week();

				goto_period_for_date(active_date);
				break;

			case 'ArrowDown':
				event.preventDefault();

				if (ctrlKey)
					activate_next_month();
				else
					activate_next_week();

				goto_period_for_date(active_date);
				break;

			case 'Enter':
				select_active_date();
				break;

			case 'Escape':
				activate_selected_date();
				break;

			case 'Tab':
				select_active_date();
				break;

			case ' ':
				if (!controlled_by) {
					event.preventDefault();
					select_active_date();
				}
				break;
		}
	}

	function has_focus() {
		return listbox_element
			? listbox_element.matches(':focus, :focus-within')
			: false;
	}

	function refocus() {
		if (!can_focus)
			return;

		const active_element = document.querySelector<HTMLElement>(`#${active_item_id}`);

		(active_element ?? listbox_element)?.focus();
	}


	// Visible period

	function goto_next_period() {
		activate_period(
			get_next_period(active_period)
		);
	}

	function goto_previous_period() {
		activate_period(
			get_previous_period(active_period)
		);
	}

	function goto_period_for_date(date: DateOnly | null) {
		if (!date)
			return;

		activate_period(
			get_period_for_date(date, active_period.first_day.day)
		);
	}

	async function activate_period(period: Period) {
		// TODO: Replace with is_same_period
		if (is_same_date(period.first_day, active_period.first_day))
			return;

		active_period = period;

		// Keep track of focused state since updating DOM will remove focus from an active option
		const focused = has_focus();

		// Ensure focus is contained in component to prevent onfocusout handler from resetting active date
		if (focused)
			listbox_element?.focus();

		// Wait for DOM update
		await tick();

		if (!active_date || !period_contains_date(period, active_date))
			activate_selected_date();

		if (focused)
			refocus();
	}

	// Activated date

	export async function activate(new_date: DateOnly | null) {
		active_date = new_date;
		active_item_id = active_date && get_item_id(active_date);

		if (has_focus())
			refocus();
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

	function activate_selected_date() {
		if (selected_date && period_contains_date(active_period, selected_date))
			activate(selected_date);
		else
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
		on_select?.(selected_date);
	}
</script>

<div
	{id}
	class={['calendar variant-primary', props.class]}
	onfocusout={event => {
		const focused_element = event.relatedTarget;
		const option_focused =
			focused_element instanceof Node &&
			listbox_element?.contains(focused_element);

		if (!option_focused)
			activate_selected_date();
	}}
>
	<header>
		{header_text}

		<div class="button-group">
			<button
				class="button-outlined button--round button--small"
				title="Previous month"
				tabindex={can_focus ? 0 : -1}
				type="button"
				onclick={
					goto_previous_period
				}
			>
				<span class="button-icon">
					<ChevronLeftIcon />
				</span>
			</button>
			<button
				class="button-outlined button--round button--small"
				title="Next month"
				tabindex={can_focus ? 0 : -1}
				type="button"
				onclick={
					goto_next_period
				}
			>
				<span class="button-icon">
					<ChevronRightIcon />
				</span>
			</button>
		</div>
	</header>

	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<div
		bind:this={listbox_element}
		aria-label="Dates"
		role="listbox"
		tabindex={can_focus ? (active_item_id ? -1 : 0) : undefined}
		onkeydown={
			handle_key_down
		}
		onmouseout={() => {
			activate_selected_date();
		}}
	>
		{#each week_days_short as week_day (week_day)}
			<div role="heading" aria-level="4">
				{week_day}
			</div>
		{/each}

		{#each visible_dates as date (date.element_id) }
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				aria-current={date.is_active ? true : undefined}
				aria-selected={date.is_selected ? true : undefined}
				aria-label={to_date(date).toLocaleDateString('en', aria_label_format)}
				class={[{
					'background-contrast': date.weekend,
					'text-weak': !date.same_month,
					'today': date.is_today,
				}]}
				id={date.element_id}
				role="option"
				tabindex={can_focus ? (date.is_active ? 0 : -1) : undefined}
				onclick={() => {
					select_date(date)
				}}
				onmouseover={() => {
					activate(date);
				}}
			>
				{date.day}
			</div>
		{/each}
	</div>
</div>

<EventHandler
	element={controlled_by}
	onkeydown={handle_key_down}
/>

<style>
	[role=listbox] {
		&:focus-visible {
			box-shadow: var(--shadow__focus);
		}
	}
</style>
