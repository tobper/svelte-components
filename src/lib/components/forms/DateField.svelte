<script lang="ts">
	import { get_date_only_key, is_same_date, try_parse_date_only, type DateOnly, type Period } from '@tobper/eon';
	import { type ComponentProps } from 'svelte';
	import { device } from '../../device.js';
	import { unique_id } from '../../unique_id.js';
	import Calendar from '../Calendar.svelte';
	import CalendarMenu from '../CalendarMenu.svelte';
	import CalendarIcon from '../icons/CalendarIcon.svelte';
	import TextField from './TextField.svelte';

	type CalendarMenuProps = ComponentProps<typeof CalendarMenu>;
	type TextFieldProps = ComponentProps<typeof TextField>;

	interface DateField {
		id?: string;
		readonly?: boolean;
		value?: DateOnly | null;

		on_clear?: () => void;
		on_select?: CalendarMenuProps['on_select'];

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
		period,
		readonly = false,
		value: selected_date = $bindable(null),

		on_clear,
		on_select,

		...text_field_props
	}: DateField = $props();

	let input_value = $state('');
	let active_item_id = $state<string | null>(null);
	let calendar = $state<ReturnType<typeof Calendar>>()
	let focused = $state(false);
	let field_element = $state<HTMLElement>();
	let input_element = $state<HTMLInputElement>();
	let menu_id = $derived(`${id}_menu`);
	let menu_visible = $state(false);
	let modal = device.mobile || device.tablet;

	// Always update input value when selected date changes
	$effect.pre(() => {
		input_value = selected_date ? get_date_only_key(selected_date) : '';
	});
</script>

<TextField
	bind:field_element
	bind:input_element
	bind:focused
	bind:value={input_value}
	{...text_field_props}
	{id}
	aria_activedescendant={calendar && active_item_id}
	aria_controls={calendar && menu_id}
	aria_expanded={calendar && menu_visible}
	aria_haspopup={calendar && 'menu'}
	readonly={readonly || modal}
	role="combobox"
	type="text"
	onclick={() => {
		menu_visible = true;
	}}
	oninput={() => {
		menu_visible = true;

		if (input_value === '') {
			selected_date = null;
		}
		else {
			const input_date = try_parse_date_only(input_value);
			if (input_date)
				selected_date = input_date;
			else
				calendar?.activate(null);
		}
	}}
	on_clear={() => {
		menu_visible = false;
		selected_date = null;
		on_clear?.();
	}}
	on_focus_out={() => {
		menu_visible = false;

		const input_as_date = try_parse_date_only(input_value);

		if (input_as_date) {
			if (selected_date === null || !is_same_date(input_as_date, selected_date)) {
				selected_date = input_as_date;
				on_select?.(selected_date);
			}
		}
		else {
			input_value = '';

			if (selected_date) {
				selected_date = null;
				on_clear?.();
			}
		}
	}}
>
	{#snippet suffix_icon()}
		<CalendarIcon />
	{/snippet}

	{#if field_element && !readonly}
		<CalendarMenu
			bind:active_item_id
			bind:calendar
			bind:selected_date
			bind:visible={menu_visible}
			{modal}
			{period}
			{on_select}
			anchor={field_element}
			keyboard_capture={input_element}
		/>
	{/if}
</TextField>
