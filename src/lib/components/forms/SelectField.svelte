<script lang="ts" generics="Option">
	import { tick, type ComponentProps } from 'svelte';
	import { device } from '../../device.js';
	import { async_value } from '../../reactivity.svelte.js';
	import { unique_id } from '../../unique_id.js';
	import SelectList from '../SelectList.svelte';
	import SelectMenu from '../SelectMenu.svelte';
	import TextField from './TextField.svelte';

	type SelectListProps = ComponentProps<typeof SelectList<Option>>;
	type TextFieldProps = ComponentProps<typeof TextField>;

	interface SelectField {
		/**
		 * Class to apply to the menu element.
		 */
		class_menu?: string;
		empty_text?: string;
		/**
		 * Options to display in the popup menu.
		 */
		options: Option[] | ((query: string) => Option[] | Promise<Option[]>);
		/** 
		 * Callback that is called for each option to determine the label of the option.
		 * @default No header is displayed.
		 */
		options_heading?: (option: Option) => string;
		/**
		 * Callback that is called for each option to determine the label of the option.
		 * @default Value is displayed as label.
		 */
		options_label?: (option: Option) => string;
		/**
		 * Callback that is called for each option to determine the value of the option.
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
		disabled?: TextFieldProps['disabled'];
		error_hint?: TextFieldProps['error_hint'];
		errors?: TextFieldProps['errors'];
		label?: TextFieldProps['label'];
		name?: TextFieldProps['name'];
		placeholder?: TextFieldProps['placeholder'];
		readonly?: TextFieldProps['readonly'];
		required?: TextFieldProps['required'];
		prefix?: TextFieldProps['prefix'];
		prefix_icon?: TextFieldProps['prefix_icon'];
		suffix?: TextFieldProps['suffix'];
		suffix_icon?: TextFieldProps['suffix_icon'];
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

	const async_options = async_value<Array<Option>>([], {
		on_updated: async () => {
			// Wait for list to update
			await tick();

			if (menu_visible)
				list?.activate_item_starting_with(selected_value);
		}
	});
	const { delayed, loaded } = $derived(async_options);
	const options = $derived(async_options.value);
	const modal = $derived((device.tablet || device.mobile) && type === 'select' && Array.isArray(options_source));
	const menu_id = $derived(`${id}_menu`);

	let input_value = $state('');
	let active_item_id = $state<string | null>(null);
	let field_element = $state<HTMLElement>();
	let field_input_element = $state<HTMLElement>();
	let focused = $state(false);
	let list = $state<ReturnType<typeof SelectList>>();
	let menu_visible = $state(false);
	let text_field = $state<ReturnType<typeof TextField>>();

	// Set provided options when it is an array
	$effect.pre(() => {
		if (Array.isArray(options_source))
			async_options.set(options_source);
		else
			async_options.reset();
	});

	// Always update input value when selected value changes
	$effect.pre(() => {
		input_value = selected_value ?? '';
	});

	// Always expose input value as selected for auto complete fields	
	$effect.pre(() => {
		if (type === 'autocomplete')
			selected_value = input_value ? input_value : null;
	});
</script>

<TextField
	bind:this={text_field}
	bind:field_element
	bind:field_input_element
	bind:focused
	bind:value={input_value}
	{...text_field_Props}
	{id}
	aria_activedescendant={list && active_item_id}
	aria_autocomplete={list && 'list'}
	aria_controls={list && menu_id}
	aria_expanded={list && menu_visible}
	aria_haspopup={list && 'menu'}
	name={name}
	loading={delayed}
	readonly={readonly || modal}
	role={list && 'combobox'}
	onclick={() => {
		if (options.length > 0 || !!empty_text)
			menu_visible = true;
	}}
	oninput={() => {
		menu_visible = true;

		if (Array.isArray(options_source))
			list?.activate_item_starting_with(input_value);
		else  if (input_value)
			async_options.set(options_source(input_value));
		else
			async_options.reset();
	}}
	on_clear={() => {
		menu_visible = false;
		selected_value = null;
		on_clear?.();
	}}
	on_focus_out={() => {
		menu_visible = false;

		if (type === 'select') {
			const option =
				loaded &&
				options.find(option => options_value(option) === input_value);

			if (option) {
				const option_value = options_value(option);

				if (selected_value !== option_value) {
					selected_value = option_value;
					on_select?.(option);
				}
			}
			else {
				input_value = '';
				selected_value = null;
				on_clear?.();
			}
		}
	}}
>
	{#if field_element && !readonly}
		<SelectMenu
			bind:active_item_id
			bind:list
			bind:value={selected_value}
			bind:visible={menu_visible}
			{empty_text}
			{modal}
			{options}
			{options_heading}
			{options_label}
			{options_value}
			{on_select}
			anchor={field_element}
			class={class_menu}
			id={menu_id}
			keyboard_capture={field_input_element}
		/>
	{/if}
</TextField>
