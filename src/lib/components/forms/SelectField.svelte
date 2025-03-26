<script lang="ts" generics="Option">
	import { scroll_into_view } from '$lib/html.js';
	import { type ComponentProps } from 'svelte';
	import { device } from '../../device.js';
	import { unique_id } from '../../unique_id.js';
	import { anchor, anchoring_supported } from '../anchor.js';
	import AnchorPlugin from '../AnchorPlugin.svelte';
	import { create_list, type ListItemOption } from '../list.svelte.js';
	import SelectList from '../SelectList.svelte';
	import TextField from './TextField.svelte';

	type OptionsSource = Option[] | ((query: string) => Option[] | Promise<Option[]>);
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
		options: OptionsSource;
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
		value: bound_value = $bindable(null),

		on_clear,
		on_select,

		...text_field_props
	}: SelectField = $props();
	
	export function focus() {
		text_field?.focus()
	}

	const list = $derived.by(() => {
		if (readonly)
			return undefined;

		return create_list(
			`${id}_list`,
			type,
			options_source,
			empty_text,
			options_heading,
			options_label,
			options_value,
		);
	});

	const modal_options_limit = 6
	const modal = $derived(
		device.touch &&
		type === 'select' &&
		Array.isArray(options_source) &&
		options_source.length <= modal_options_limit
	);
	let input_text = $state('');
	let input_element = $state<HTMLInputElement>();
	let list_element = $state<HTMLElement>();
	let text_field = $state<ReturnType<typeof TextField>>();

	// Scroll to active item
	$effect(() => {
		scroll_into_view(list?.active_item?.id);
	});

	$effect(() => {
		list_element?.togglePopover(list?.visible);
	});

	// Always update input value when bound value changes
	$effect.pre(() => {
		input_text = bound_value ?? '';
	});

	// Always expose input value as bound for auto complete fields	
	$effect.pre(() => {
		if (type === 'autocomplete')
			bound_value = input_text || null;
	});

	function clear() {
		if (!input_text)
			return;

		input_text = '';
		bound_value = null;
		on_clear?.();
	}

	function select(item: ListItemOption<Option>) {
		input_text = item.label;

		if (bound_value !== item.value) {
			bound_value = item.value;
			on_select?.(item.option);
		}
	}

	function ensure_valid_input() {
		if (!list)
			return;

		const item = list?.get_item_with_label(input_text);

		if (item)
			select(item);
		else
			clear();
	}
</script>

<TextField
	bind:this={text_field}
	bind:input_element
	bind:value={input_text}
	{...text_field_props}
	{id}
	aria_activedescendant={list?.active_item?.id}
	aria_autocomplete={list ? 'list' : undefined}
	aria_controls={list?.id}
	aria_expanded={list?.visible}
	aria_haspopup={list ? 'listbox' : undefined}
	name={name}
	loading={list?.loading_delayed}
	readonly={readonly || modal}
	role={list ? 'combobox' : undefined}
	onkeydown={event => {
		if (!list)
			return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();

				if (list.visible) {
					const active_item = event.ctrlKey
						? list.activate_last_item()
						: list.activate_next_item();

					if (type === 'select' && active_item)
						select(active_item);
				}
				else {
					list.open();

					if (!event.altKey) {
						const active_item =
							list.activate_item_starting_with(input_text) ??
							list.activate_first_item();

						if (type === 'select' && active_item)
							select(active_item);
					}
				}
				break;

			case 'ArrowUp':
				event.preventDefault();

				if (list.visible) {
					const active_item = event.ctrlKey
						? list.activate_first_item()
						: list.activate_previous_item();

					if (type === 'select' && active_item)
						select(active_item);
				}
				else {
					list.open();

					if (!event.altKey) {
						const active_item =
							list.activate_item_starting_with(input_text) ??
							list.activate_last_item();

						if (type === 'select' && active_item)
							select(active_item);
					}
				}
				break;

			case 'Enter':
				if (list.visible) {
					event.preventDefault();

					if (list.active_item) {
						select(list.active_item);
						list.close();
					}
				}
				break;

			case 'Escape':
				event.preventDefault();
				list.close();
				break;

			case 'Tab': {
				if (list.active_item)
					select(list.active_item);
				break;
			}
		}
	}}
	onclick={() => {
		list?.open();
		list?.activate_item_starting_with(input_text);
	}}
	oninput={() => {
		if (!list)
			return;

		list.load_items(input_text);
		list.open();

		if (type === 'select')
			list.activate_item_starting_with(input_text);
	}}
	on_clear={() => {
		bound_value = null;
		on_clear?.();
		list?.close();
	}}
	on_focus_out={() => {
		if (type === 'select')
			ensure_valid_input();

		list?.close();
	}}
>
	{#if input_element && list && list.items.length > 0}
		<div
			bind:this={list_element}
			use:anchor={{
				anchor: input_element,
				match_width: true,
			}}
			class={['menu popover popover--fade', class_menu, {
				'popover--modal': modal,
			}]}
			id={list.id}
			popover="manual"
			role="listbox"
			tabindex="-1"
		>
			{#each list.items as item, i}
				{#if item.type === 'heading'}
					{#if i > 0}
						<div role="separator">
							<hr />
						</div>
					{/if}

					<div role="heading" aria-level="4">
						{item.label}
					</div>
				{:else if item.type === 'presentation'}
					<div role="presentation">
						{item.label}
					</div>
				{:else if item.type === 'option'}
					<!-- svelte-ignore a11y_interactive_supports_focus -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_mouse_events_have_key_events -->
					<div
						aria-current={item === list.active_item ? true : undefined}
						aria-selected={type === 'select' && item.value === bound_value ? true : undefined}
						id={item.id}
						onclick={() => {
							select(item);
							list.close();
						}}
						onmouseover={() => {
							list.activate(item);
						}}
						role="option"
					>
						{item.label}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</TextField>

{#if !anchoring_supported && input_element && list_element}
	<AnchorPlugin
		anchor={input_element}
		anchored={list_element}
		width="anchor"
	/>
{/if}

<style>
	.menu {
		overflow-y: auto;
		max-height: calc(
			2 * var(--menu__border-width) +
			2 * var(--menu__padding) +
			round(down, 25vh, 3rem)
		);
		scroll-padding-top: var(--menu__padding);
		scroll-padding-bottom: var(--menu__padding);
	}

	[role=heading],
	[role=option],
	[role=presentation] {
		padding-inline: var(--space);

		align-content: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	[role=heading] {
		cursor: default;
		color: var(--list-item-heading__color);
		font-size: var(--list-item-heading__font-size);
		letter-spacing: var(--list-item-heading__letter-spacing);
		min-height: var(--space__large);
	}

	[role=option],
	[role=presentation] {
		min-height: var(--space__x-large);
	}

	[role=option] {
		cursor: pointer;
	}

	[role=separator] {
		padding: var(--space__tiny) 0;
	}

	[aria-current] {
		background-color: var(--list-item__background-color--active);
	}
</style>