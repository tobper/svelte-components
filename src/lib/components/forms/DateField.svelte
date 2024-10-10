<script lang="ts">
	import { unique_id } from '$lib/unique_id.js';
	import { get_date_only_key, is_same_date, try_parse_date_only, type DateOnly } from '@tobper/eon';
	import { device } from '../../device.js';
	import Calendar from '../Calendar.svelte';
	import CalendarMenu from '../CalendarMenu.svelte';
	import CalendarIcon from '../icons/CalendarIcon.svelte';
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

	let {
		id = $bindable(unique_id()),
		readonly = false,
		value: selected_date = $bindable(null),
		...text_field_props
	}: DateField = $props();

	let active_descendant = $state<string | null>(null);
	let calendar = $state<ReturnType<typeof Calendar>>()
	let focused = $state(false);
	let field_element = $state<HTMLElement>();
	let field_input_element = $state<HTMLElement>();
	let menu_id = $derived(`${id}_menu`);
	let menu_visible = $state(false);
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
	{id}
	aria_activedescendant={calendar && active_descendant}
	aria_controls={calendar && menu_id}
	aria_expanded={calendar && menu_visible}
	aria_haspopup={calendar && 'menu'}
	readonly={readonly || device.mobile}
	role="combobox"
	type="text"
	onclick={() => {
		if (focused || device.mobile)
			menu_visible = true;
	}}
	on_clear={() => {
		selected_date = null;
	}}
	on_focus_in={() => {
		menu_visible = true;
	}}
	on_focus_out={() => {
		menu_visible = false;
		input_proxy.value = selected_date
			? get_date_only_key(selected_date)
			: '';
	}}
>
	{#snippet icon()}
		<CalendarIcon />
	{/snippet}

	{#if !readonly}
		<CalendarMenu
			bind:active_descendant
			bind:calendar
			bind:selected_date
			bind:visible={menu_visible}
			anchor={field_input_element!}
			keyboard_capture={field_input_element}
			modal={device.mobile}
		/>
	{/if}
</TextField>
