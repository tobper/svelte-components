<script lang="ts">
	import { get_date_only_key, is_same_date, try_parse_date_only, type DateOnly, type Period } from '@tobper/eon';
	import { type ComponentProps } from 'svelte';
	import { device } from '../../device.js';
	import { unique_id } from '../../unique_id.js';
	import Button from '../Button.svelte';
	import Calendar from '../Calendar.svelte';
	import CalendarMenu from '../CalendarMenu.svelte';
	import CalendarIcon from '../icons/CalendarIcon.svelte';
	import ClearIcon from '../icons/ClearIcon.svelte';
	import TextField from './TextField.svelte';

	type TextFieldProps = ComponentProps<typeof TextField>;

	interface DateField {
		id?: string;
		readonly?: boolean;
		value?: DateOnly | DateOnly[] | null;

		on_clear?: () => void;
		on_deselect?: (date: DateOnly) => void;
		on_select?: (date: DateOnly) => void;

		/**
		 * Class to apply to the field element.
		 */
		class?: TextFieldProps['class'];
		disabled?: TextFieldProps['disabled'];
		error_hint?: TextFieldProps['error_hint'];
		errors?: TextFieldProps['errors'];
		label?: TextFieldProps['label'];
		name?: TextFieldProps['name'];
		/**
		 * The period currently being displayed.
		 */
		period?: Period | null;
		placeholder?: TextFieldProps['placeholder'];
		required?: TextFieldProps['required'];
	}

	let {
		id = $bindable(unique_id()),
		name,
		period,
		readonly = false,
		value: bound_value = $bindable(null),

		on_clear,
		on_deselect,
		on_select,

		...text_field_props
	}: DateField = $props();

	const calendar_id = $derived(`${id}_calendar`);
	const menu_id = $derived(`${id}_menu`);
	const modal = device.mobile || device.tablet;

	let active_item_id = $state<string | null>(null);
	let calendar = $state<ReturnType<typeof Calendar>>()
	let focused = $state(false);
	let field_element = $state<HTMLElement>();
	let input_element = $state<HTMLInputElement>();
	let menu_visible = $state(false);
	let input_text = $derived(
		is_multi_select(bound_value)
			? ''
			: (bound_value ? get_date_only_key(bound_value) : '')
	);

	function clear() {
		if (is_single_select(bound_value)) {
			bound_value = null;
		}

		if (input_text) {
			input_text = '';
			on_clear?.();
		}
	}

	function select(new_date: DateOnly) {
		if (is_multi_select(bound_value)) {
			// Add date to array if it is not already selected
			if (new_date && !bound_value.some(date => is_same_date(date, new_date))) {
				bound_value = [...bound_value, new_date];
				on_select?.(new_date);
			}
		}
		else {
			input_text = get_date_only_key(new_date);

			// Update selected date if it is different than current
			if (!bound_value || !is_same_date(bound_value, new_date)) {
				bound_value = new_date;
				on_select?.(new_date);
			}
		}
	}

	function is_multi_select(value: typeof bound_value): value is DateOnly[] {
		return Array.isArray(value);
	}

	function is_single_select(value: typeof bound_value): value is DateOnly | null {
		return !is_multi_select(value);
	}
</script>

<TextField
	bind:field_element
	bind:input_element
	bind:focused
	bind:value={input_text}
	{...text_field_props}
	{id}
	aria_activedescendant={calendar && active_item_id}
	aria_controls={calendar && calendar_id}
	aria_expanded={calendar && menu_visible}
	aria_haspopup={calendar && 'menu'}
	name={is_single_select(bound_value) ? name : undefined}
	readonly={readonly || modal}
	role="combobox"
	type="text"
	onclick={() => {
		menu_visible = true;
	}}
	oninput={() => {
		menu_visible = true;

		const input_date = try_parse_date_only(input_text);
		if (input_date)
			calendar?.activate(input_date);
	}}
	on_clear={() => {
		menu_visible = false;
		clear();
	}}
	on_focus_out={() => {
		menu_visible = false;

		const input_date = try_parse_date_only(input_text);
		if (input_date) {
			select(input_date);

			// Reset text for multi value
			if (is_multi_select(bound_value))
				input_text = '';
		}
		else {
			clear();
		}
	}}
>
	{#snippet prefix()}
		{#if is_multi_select(bound_value)}
			{@const values = bound_value.map(date => ({ date, text: get_date_only_key(date)}))}
			{#each values as { date, text }, index (text)}
				<Button
					disabled={readonly}
					icon={clear_icon}
					text={text}
					type="plain"
					variant="delete"
					onclick={() => {
						if (is_multi_select(bound_value)) {
							bound_value = bound_value.toSpliced(index, 1);
							on_deselect?.(date);
						}
					}}
				/>
			{/each}
		{/if}
	{/snippet}

	{#snippet suffix_icon()}
		<CalendarIcon />
	{/snippet}

	{#if field_element && input_element && !readonly}
		<CalendarMenu
			bind:active_item_id
			bind:calendar
			bind:date={
				() => is_single_select(bound_value) ? bound_value : null,
				new_date => {
					if (new_date)
						select(new_date);
					else
						clear();
				}
			}
			bind:visible={menu_visible}
			{calendar_id}
			{period}
			anchored_to={field_element}
			controlled_by={input_element}
			id={menu_id}
			on_select={() => {
				menu_visible = false;
			}}
		/>
	{/if}

	{#if name && is_multi_select(bound_value)}
		{@const values = bound_value.map(get_date_only_key)}
		{#each values as value (value)}
			<input type="hidden" {name} {value} />
		{/each}
	{/if}
</TextField>

{#snippet clear_icon()}
	<ClearIcon />
{/snippet}
