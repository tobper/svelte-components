<script lang="ts">
	import { get_date_only_key, is_same_date, try_parse_date_only, type DateOnly } from '@tobper/eon';
	import { device } from '../../device.js';
	import { unique_id } from '../../unique_id.js';
	import Button from '../Button.svelte';
	import Calendar from '../Calendar.svelte';
	import CalendarIcon from '../icons/CalendarIcon.svelte';
	import Menu from '../Menu.svelte';
	import { input_value_proxy } from './internal/input_value_proxy.js';
	import TextField from './TextField.svelte';

	interface DateField {
		calendar_default_date?: DateOnly;
		class?: string;
		disabled?: boolean;
		error_hint?: boolean;
		id?: string;
		label?: string;
		name?: string;
		placeholder?: string;
		readonly?: boolean;
		required?: boolean;
		value?: DateOnly | null;
	}

	const menu_trigger_id = unique_id();

	let {
		readonly = false,
		value: selected_date = $bindable(null),
		...text_field_props
	}: DateField = $props();

	let calendar = $state<ReturnType<typeof Calendar>>();
	let calendar_active_id = $state<string | null>(null);
	let calendar_visible = $state(false);
	let focused = $state(false);
	let field_element = $state<HTMLElement>();
	let field_input_element = $state<HTMLElement>();
	let text_field = $state<ReturnType<typeof TextField>>();
	let input_proxy = input_value_proxy(
		() => selected_date,
		value => selected_date = value,
		try_parse_date_only,
		get_date_only_key,
		is_same_date
	);
</script>

<TextField
	bind:this={text_field}
	bind:field_element
	bind:field_input_element
	bind:focused
	bind:value={input_proxy.value}
	{...text_field_props}
	aria_activedescendant={calendar_active_id}
	aria_expanded={calendar_visible}
	aria_haspopup="listbox"
	readonly={readonly || device.mobile}
	role="combobox"
	type="text"
	onclick={() => {
		if (focused || device.mobile)
			calendar_visible = true;
	}}
	onkeydown={event => {
		if (calendar_visible) {
			switch (event.key) {
				case 'Escape':
					calendar_visible = false;
					break;
		  	}
		}
		else {
			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowUp':
					calendar_visible = true;
					event.preventDefault();
					break;
			}
		}
	}}
	on_clear={() => {
		selected_date = null;
	}}
	on_focus_in={() => {
		calendar_visible = true;
	}}
	on_focus_out={() => {
		calendar_visible = false;
		input_proxy.value = selected_date
			? get_date_only_key(selected_date)
			: '';
	}}
>
	{#snippet suffix()}
		<Button
			id={menu_trigger_id}
			focusable={false}
			type="plain"
			onclick={() => {
				calendar_visible = true;
				text_field?.focus();
			}}
		>
			{#snippet icon()}
				<CalendarIcon />
			{/snippet}
		</Button>
	{/snippet}

	<Menu
		bind:visible={calendar_visible}
		anchor={field_input_element!}
		modal={device.mobile}
		trigger={menu_trigger_id}
		on_open={() => {
			calendar?.reset({ selected_date });
		}}
	>
		<Calendar
			bind:this={calendar}
			bind:active_date_id={calendar_active_id}
			{selected_date}
			focusable={false}
			keyboard_capture={calendar_visible ? field_input_element : undefined}
			on_select={date => {
				selected_date = date;
				calendar_visible = false;
			}}
		/>
	</Menu>
</TextField>
