<script lang="ts" generics="Option">
	import type { ComponentProps } from 'svelte';
	import { device } from '../../device.js';
	import { async_value } from '../../reactivity.svelte.js';
	import { unique_id } from '../../unique_id.js';
	import SelectList from '../SelectList.svelte';
	import SelectMenu from '../SelectMenu.svelte';
	import TextField from './TextField.svelte';

	type SelectListProps = ComponentProps<typeof SelectList>;
	type TextFieldProps = ComponentProps<typeof TextField>;

	interface SelectField {
		class_menu?: string;
		disabled?: boolean;
		empty_text?: string;
		error_hint?: boolean;
		options: Option[] | ((query: string) => Option[] | Promise<Option[]>);
		/** 
		 * Callback is called for each option to determine the label of the option.
		 * @default No header
		 */
		options_heading?: (option: Option) => string;
		/**
		 * Callback is called for each option to determine the label of the option.
		 * @default Same as value.
		 */
		options_label?: (option: Option) => string;
		/**
		 * Callback is called for each option to determine the value of the option.
		 * @default Option is converted to a string.
		 */
		options_value?: (option: Option) => string;
		/**
		 * Type of field
		 * - autocomplete: Any text can be entered
		 * - select: Only available options may be selected
		 * 
		 * @default select
		 */
		type?: 'autocomplete' | 'select';
		value?: string | null;

		on_clear?: () => void;
		on_select?: SelectListProps['on_select'];

		id?: TextFieldProps['id'];
		class?: TextFieldProps['class'];
		label?: TextFieldProps['label'];
		name?: TextFieldProps['name'];
		placeholder?: TextFieldProps['placeholder'];
		readonly?: TextFieldProps['readonly'];
		required?: TextFieldProps['required'];
		icon?: TextFieldProps['icon'];
		prefix?: TextFieldProps['prefix'];
		suffix?: TextFieldProps['suffix'];
	}

	let {
		class_menu,
		empty_text,
		id = $bindable(unique_id()),
		name,
		options: options_source,
		options_heading,
		options_label,
		options_value = option => `${option}`,
		readonly,
		type = 'select',
		value: selected_value = $bindable(null),

		on_clear,
		on_select,

		...text_field_Props
	}: SelectField = $props();
	
	export function focus() {
		text_field?.focus()
	}

	const async_options = async_value<Array<Option>>([]);

	let active_descendant = $state<string | null>(null);
	let field_element = $state<HTMLElement>();
	let field_input_element = $state<HTMLElement>();
	let focused = $state(false);
	let list = $state<ReturnType<typeof SelectList>>();
	let menu_id = $derived(`${id}_menu`);
	let menu_visible = $state(false);
	let modal = $derived(device.mobile && type === 'select' && Array.isArray(options_source));
	let options = $derived(async_options.value);
	let text_field = $state<ReturnType<typeof TextField>>();

	let field_proxy = {
		get value() { return selected_value ?? ''; },
		set value(value) { selected_value = !value ? null : value; }
	}

	let load = $derived<(query: string) => void>(
		Array.isArray(options_source)
			? () => {}
			: query => async_options.set(options_source(query))
	);

	$effect(() => {
		if (Array.isArray(options_source))
			async_options.set(options_source)
	});

	$effect(() => {
		// Show menu when options have been loaded and field has focus
		if (focused && options.length)
			menu_visible = true;
	});
</script>

<TextField
	bind:this={text_field}
	bind:field_element
	bind:field_input_element
	bind:focused
	bind:value={field_proxy.value}
	{...text_field_Props}
	{id}
	aria_activedescendant={list && active_descendant}
	aria_autocomplete={list && 'list'}
	aria_controls={list && menu_id}
	aria_expanded={list && menu_visible}
	aria_haspopup={list && 'menu'}
	name={name}
	loading={async_options.loading}
	readonly={readonly || modal}
	role={list && 'combobox'}
	onclick={() => {
		if (focused)
			menu_visible = true;
	}}
	oninput={({ currentTarget: input }) => {
		list?.activate_item_starting_with(input.value);
	}}
	on_clear={() => {
		on_clear?.();
		selected_value = null;
	}}
	on_focus_in={() => {
		load(selected_value ?? '');
	}}
	on_focus_out={() => {
		menu_visible = false

		const valid =
			type === 'autocomplete' ||
			async_options.loaded && options.some(option => options_value(option) === selected_value);

		if (!valid) {
			selected_value = '';
			on_clear?.();
		}
	}}
>
	{#if !readonly && options.length > 0}
		<SelectMenu
			bind:active_descendant
			bind:list
			bind:value={selected_value}
			bind:visible={menu_visible}
			{empty_text}
			{modal}
			{options}
			{options_heading}
			{options_label}
			{options_value}
			anchor={field_element!}
			class={class_menu}
			id={menu_id}
			keyboard_capture={field_input_element}
			on_select={option => {
				selected_value = option ? options_value(option) : null;
				menu_visible = false;
				on_select?.(option);
			}}
		/>
	{/if}
</TextField>
