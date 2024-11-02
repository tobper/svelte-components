<script lang="ts" generics="Option">
	import { tick, untrack, type ComponentProps } from 'svelte';
	import { device } from '../../device.js';
	import { async_value } from '../../reactivity.svelte.js';
	import { unique_id } from '../../unique_id.js';
	import SelectList from '../SelectList.svelte';
	import SelectMenu from '../SelectMenu.svelte';
	import TextField from './TextField.svelte';

	type SelectListProps = ComponentProps<typeof SelectList<Option>>;
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
			list?.activate_item_starting_with(selected_value);
		}
	});
	const { delayed, loaded } = $derived(async_options);
	const options = $derived(async_options.value);
	const modal = $derived(device.mobile && type === 'select' && Array.isArray(options_source));
	const menu_id = $derived(`${id}_menu`);

	let active_item_id = $state<string | null>(null);
	let field_element = $state<HTMLElement>();
	let field_input_element = $state<HTMLElement>();
	let focused = $state(false);
	let list = $state<ReturnType<typeof SelectList>>();
	let menu_visible = $state(false);
	let text_field = $state<ReturnType<typeof TextField>>();

	let field_proxy = {
		get value() { return selected_value ?? ''; },
		set value(value) { selected_value = !value ? null : value; }
	}

	$effect(() => {
		if (Array.isArray(options_source))
			async_options.set(options_source)
	});

	$effect(() => {
		menu_visible = (focused && options.length > 0);
	});

	$effect(() => {
		if (focused) {
			const source = options_source;
			const value = selected_value;

			untrack(() => {
				if (Array.isArray(source)) {
					list?.activate_item_starting_with(value);
				}
				else {
					if (value)
						async_options.set(source(value));
					else
						async_options.reset();
				}
			})
		}
	})
</script>

<TextField
	bind:this={text_field}
	bind:field_element
	bind:field_input_element
	bind:focused
	bind:value={field_proxy.value}
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
	on_clear={() => {
		selected_value = null;
		on_clear?.();
	}}
	onclick={() => {
		if (focused)
			menu_visible = true;
	}}
	onkeydown={event => {
		if (event.key === 'Tab') {
			// Prevent TextField focus handling from refocusing input when tabbing away
			menu_visible = false;
		}
	}}
	on_focus_out={() => {
		const valid =
			type === 'autocomplete' ||
			loaded && options.some(option => options_value(option) === selected_value);

		if (!valid) {
			selected_value = '';
			on_clear?.();
		}
	}}
>
	{#if !readonly && options.length > 0}
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
			anchor={field_element!}
			class={class_menu}
			id={menu_id}
			keyboard_capture={field_input_element}
			on_select={option => {
				selected_value = options_value(option);
				menu_visible = false;
				on_select?.(option);
			}}
		/>
	{/if}
</TextField>
