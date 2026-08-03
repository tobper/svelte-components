<script lang="ts" generics="T">
	import { scroll_into_view } from '$lib/html.js';
	import { async_value, type Deferred } from '$lib/reactivity.svelte.js';
	import { tick, type ComponentProps } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { device } from '../../device.js';
	import { unique_id } from '../../unique_id.js';
	import { anchor } from '../anchor.js';
	import { popover } from '../popover.js';
	import SelectList from '../SelectList.svelte';
	import TextField from './TextField.svelte';

	type SelectListProps = ComponentProps<typeof SelectList<T>>;
	type TextFieldProps = ComponentProps<typeof TextField>;

	interface SelectField {
		/**
		 * Class to apply to the menu element.
		 */
		class_menu?: ClassValue;
		/**
		 * Options to display in the popup menu.
		 */
		options: Deferred<T[], [query: string]>;
		/**
		 * Callback that is called for each option to determine the value of the option.
		 * @default Option is converted to a string.
		 */
		option_value?: SelectListProps['option_value'];
		/**
		 * Callback that is called for each option to determine the heading of the option.
		 * @default No header is displayed.
		 */
		option_heading?: SelectListProps['option_heading'];
		/**
		 * ...
		 */
		option_icon?: SelectListProps['option_icon'];
		/**
	 	 * Callback that is called for each option to determine the children of the option.
		 */
		option_children?: SelectListProps['option_children'];
		/**
		 *
		 */
		empty_text?: SelectListProps['empty_text'];
		/**
		 * Type of field
		 * - autocomplete: Any text can be entered
		 * - select: Only available options may be selected
		 *
		 * @default select
		 */
		type?: 'autocomplete' | 'select';
		value?: string | null;
		/**
		 *
		 */
		virtualized?: SelectListProps['virtualized'];

		on_clear?: () => void;
		on_select?: (option: T) => void;

		id?: TextFieldProps['id'];
		autofocus?: TextFieldProps['autofocus'];
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
		class: class_text,
		class_menu,
		empty_text,
		id = $bindable(unique_id()),
		name,
		options: options_source,
		option_heading,
		option_icon,
		option_value,
		option_children,
		readonly,
		type = 'select',
		value: bound_value = $bindable(null),
		virtualized,

		on_clear,
		on_select,

		...text_field_props
	}: SelectField = $props();

	export function focus() {
		text_field?.focus()
	}

	const options = async_value<T[]>([], {
		on_updated(options) {
			if (menu_visible && (options.length === 0))
				menu_visible = false;

			if (type === 'select')
				activate_current_value()
		}
 	});
	let list = $state<SelectList<T>>();
	let content_element = $state<HTMLElement>();
	let input_element = $state<HTMLInputElement>();
	let active_item_id = $state<string | null>(null);
	let menu_visible = $state(false);
	let text_field = $state<ReturnType<typeof TextField>>();
	let input_text = $derived(bound_value ?? '');

	function activate_current_value() {
		if (!list)
			return;

		const activated_item = list?.activate_item_starting_with(input_text);
		if (activated_item?.value === input_text) {
			bound_value = activated_item.value;
		}
		else if (bound_value) {
			const value = input_text;
			bound_value = null;
			tick().then(() => {
				input_text = value;
			});
		}

		if (activated_item) {
			tick().then(() => {
				scroll_into_view(activated_item.id);
			});
		}
	}

	const modal_options_limit = 6
	const modal = $derived(
		device.touch &&
		type === 'select' &&
		Array.isArray(options_source) &&
		options_source.length <= modal_options_limit
	);

	$effect(() => {
		if (readonly)
			return;

		options.set(
			Array.isArray(options_source)
				? options_source
				: options_source(input_text)
		);
	});

	function clear() {
		if (bound_value !== null) {
			bound_value = null;
			on_clear?.();
		}
		else if (input_text) {
			input_text = '';
		}
	}

	function select(option: T, value: string) {
		if (bound_value !== value) {
			bound_value = value;
			on_select?.(option);
		}
		else if (input_text !== value) {
			input_text = value;
		}
	}

	function ensure_valid_input() {
		if (!list)
			return;

		const item = list.find_item(input_text);
		if (item)
			select(item.option, item.value);
		else
			clear();
	}

	function open() {
		menu_visible = !readonly && (options.loading || options.current.length > 0);
	}

	function close() {
		active_item_id = null;
		menu_visible = false;
	}
</script>

<TextField
	bind:this={text_field}
	bind:content_element
	bind:input_element
	bind:value={
		() => input_text,
		value => {
			if (type === 'autocomplete') {
				bound_value = value;
			}
			else {
				input_text = value;

				if (Array.isArray(options_source))
					activate_current_value();
			}

			tick().then(open);
		}
	}
	{...text_field_props}
	{id}
	aria_activedescendant={active_item_id}
	aria_autocomplete={list ? 'list' : undefined}
	aria_controls={list?.id}
	aria_expanded={menu_visible}
	aria_haspopup={list ? 'listbox' : undefined}
	class={['select-field', class_text]}
	name={name}
	loading={list?.loading_delayed}
	readonly={readonly || modal}
	role={list ? 'combobox' : undefined}
	onkeydown={event => {
		if (!list)
			return;

		switch (event.key) {
			case 'ArrowDown':
				if (!menu_visible) {
					event.preventDefault();
					open();

					if (!event.altKey) {
						if (!list.activate_item_starting_with(input_text))
							list.activate_first_item();
					}
				}
				break;

			case 'ArrowUp':
				if (!menu_visible) {
					event.preventDefault();
					open();

					if (!event.altKey) {
						if (!list.activate_item_starting_with(input_text))
							list.activate_last_item();
					}
				}
				break;

			case 'Enter':
				if (menu_visible) {
					event.preventDefault();
					list.select_active_item();
					close();
				}
				break;

			case 'Escape':
				if (menu_visible) {
					event.preventDefault();
					close();
				}
				break;

			case 'Tab': {
				list.select_active_item();
				break;
			}
		}
	}}
	onclick={() => {
		open();
	}}
	on_clear={() => {
		close();
		clear();
	}}
	on_focus_out={() => {
		if (type === 'select')
			ensure_valid_input();

		close();
	}}
>
	{#if content_element && options.current.length}
		<div
			use:anchor={{
				anchor: content_element,
				match_width: true
			}}
			use:popover={{
				animation: 'fade',
				modal,
				visible: menu_visible
			}}
			popover="auto"
			ontoggle={e => {
				menu_visible = e.newState === 'open';
			}}
		>
			<SelectList
				bind:this={list}
				bind:active_item_id
				class={['menu', class_menu]}
				controlled_by={input_element}
				empty_text={empty_text}
				filter={Array.isArray(options_source) ? input_text : undefined}
				id={`${id}_list`}
				options={options.current}
				option_heading={option_heading}
				option_icon={option_icon}
				option_value={option_value}
				option_children={option_children}
				value={bound_value}
				virtualized={virtualized}
				on_select={(option, value) => {
					select(option, value);
					close();
				}}
			/>
		</div>
	{/if}
</TextField>

<style>
	:global(.select-field .menu) {
		overflow-y: auto;
		max-height: calc(
			2 * var(--menu__border-width) +
			2 * var(--menu__padding) +
			round(down, 25vh, 3rem)
		);
		scroll-padding-top: var(--menu__padding);
		scroll-padding-bottom: var(--menu__padding);
	}
</style>
