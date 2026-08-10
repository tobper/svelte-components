<script lang="ts" module>
	export type Value<T> = T | (() => T);

	export type CommandPaletteOption =
		| CommandPaletteActionOption
		| CommandPaletteGroupOption;

	export interface CommandPaletteActionOption {
		icon: Snippet | Component;
		label: string;
		action: Value<CommandPaletteAction | CommandPaletteActionGroup>;
		state?: Value<string | undefined>;
	}

	export interface CommandPaletteGroupOption {
		icon: Snippet | Component;
		label: string;
		children: Value<CommandPaletteActionOption[]>;
		caption?: Value<string | undefined>;
		state?: Value<string | undefined>;
	}

	export interface CommandPaletteAction {
		run(): void;
		name?: string;
		caption?: Value<string | undefined>;
		valid?: Value<boolean | undefined>;
	}

	export interface CommandPaletteActionGroup {
		default:  CommandPaletteAction;
		alt?:  CommandPaletteAction;
		control?:  CommandPaletteAction;
		meta?:  CommandPaletteAction;
		shift?:  CommandPaletteAction;
	}
</script>

<script lang="ts">
	import { handle_keyboard_event } from '$lib/html';
	import { getModifierKeys } from '$lib/key_bindings.svelte';
	import { create_normalized_lookup } from '$lib/normalization';
	import { tick, untrack, type Component, type Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';
	import DialogContent from './DialogContent.svelte';
	import DialogFooter from './DialogFooter.svelte';
	import Kbd from './Kbd.svelte';
	import SelectList from './SelectList.svelte';

	type Option = CommandPaletteOption;
	type Action =  CommandPaletteAction;
	type ActionModifier = keyof CommandPaletteActionGroup;
	type ActionOption = CommandPaletteActionOption;
	type GroupOption = CommandPaletteGroupOption;

	interface CommandPaletteProps {
		keys?: (command: string) => string | string[] | undefined;
		options: Option[];
		query?: string;
		visible?: boolean;
	}

	const modifier_keys = getModifierKeys();

	let {
		keys,
		options: root_options,
		query = $bindable(''),
		visible = $bindable(false),
	}: CommandPaletteProps = $props();

	let input_element = $state<HTMLInputElement>();
	let all_actions_visible = $state(false);
	let selected_group = $state<{ query: string; option: GroupOption }>();
	let current_option = $state<Option>();

	const current_lookup = $derived(
		createLookup(
			selected_group
				? getValue(selected_group.option.children)
				: root_options,
		)
	);
	const filtered_options = $derived(
		query
			? current_lookup.find_all(query)
			: selected_group
				? getValue(selected_group.option.children)
				: []
	);

	$effect(() => {
		// Refresh options in selected group
		const updated_options = root_options;

		untrack(() => {
			if (!selected_group)
				return;

			const selected_label = selected_group.option.label;
			const updated_group = updated_options.find(o => o.label === selected_label);

			if (isGroupOption(updated_group))
				selected_group.option = updated_group;
			else
				selected_group = undefined;
		});
	});

	$effect(() => {
		// Refresh currently selected item based on updated filtered options
		const updated_options = filtered_options;

		untrack(() => {
			if (!current_option) {
				if (updated_options.length)
					current_option = updated_options[0];

				return;
			}

			const current_option_label = current_option.label;

			current_option = updated_options.find(o => o.label === current_option_label);

			if (!current_option && updated_options.length)
				current_option = updated_options[0]
		});
	});

	function createLookup(options: Option[]) {
		return create_normalized_lookup(options, option => option.label);
	}

	function select(option: Option) {
		if (isDisabled(option))
			return;

		if (isActionOption(option)) {
			const [action] = getModifiedAction(option);

			visible = false;
			action.run();
		} else {
			showChildren(option);
		}
	}

	function selectCurrentOption() {
		if (current_option)
			select(current_option);
	}

	function showChildren(option: GroupOption) {
		selected_group = { query, option };
		query = '';
	}

	function hasMultipleActions(option: ActionOption) {
		const action = getValue(option.action);

		if ('run' in action)
			return false;

		return (
			!!action.alt ||
			!!action.control ||
			!!action.meta ||
			!!action.shift
		);
	}

	function showAllActions() {
		if (!current_option || !isActionOption(current_option))
	 		return;

		all_actions_visible = !all_actions_visible;
	}

	function clear() {
		if (query)
			query = '';
		else
			popGroup();
	}

	function closeDialog() {
		visible = false
	}

	function popGroup() {
		if (!selected_group)
			return;

		query = selected_group.query;
		selected_group = undefined;

		tick().then(() => {
			input_element?.select();
		});
	}

	function getDefaultAction(option: ActionOption) {
		const action = getValue(option.action);

		return 'run' in action
			? action
			: action.default;
	}

	function getCaption(value: Action | GroupOption) {
		return 'children' in value
			? getValue(value.caption) ?? `Show ${value.label}`
			: getValue(value.caption) ?? value.name;
	}

	function getKbd(option: Option) {
		if (!keys || isGroupOption(option))
			return undefined;

		const [{ name }] = getModifiedAction(option);
		const kbd = name && keys(name);

		return kbd;
	}

	function getState(option: Pick<Option, 'state'>) {
		return getValue(option.state);
	}

	function getModifiedAction(option: ActionOption): [Action, string[]] {
		const action = getValue(option.action);

		if ('run' in action)
			return [action, []];

		if (modifier_keys.alt && action.alt)
			return [action.alt, ['alt']];

		if (modifier_keys.control && action.control)
			return [action.control, ['control']];

		if (modifier_keys.meta && action.meta)
			return [action.meta, ['meta']];

		if (modifier_keys.shift && action.shift)
			return [action.shift, ['shift']];

		return [action.default, []];
	}

	function getModifierActions(option: ActionOption) {
		if ('run' in option.action)
			return [];

		return Object
			.entries(option.action)
			.filter(([modifier]) => modifier !== 'default')
			.filter((action): action is [ActionModifier,  CommandPaletteAction] =>
				action[1] !== undefined
			)
			.map(([modifier, action]) => ({ modifier, action }));
	}

	function getValue<T>(arg: Value<T>) {
		return arg instanceof Function ? arg() : arg;
	}

	function isDisabled(option_or_action: Option | Action) {
		if ('run' in option_or_action) {
			const action = option_or_action;
			const valid = getValue(action.valid) ?? true;
			return !valid;
		}

		if (isActionOption(option_or_action)) {
			const option = option_or_action;
			const [action] = getModifiedAction(option);
			return isDisabled(action);
		}

		return false;
	}

	function isActionOption(option?: Option): option is ActionOption {
		return !!option && 'action' in option;
	}

	function isGroupOption(option?: Option): option is GroupOption {
		return !!option && 'children' in option;
	}
</script>

<Dialog
	{visible}
	class="command-palette"
	propagate_key_events
	width="50rem"
	on_open={() => {
		tick().then(() => {
			input_element?.select();
		});
	}}
	on_closed={() =>
		visible = false
	}
>
	<header class="dialog-header">
		<search>
			{#if selected_group}
				<button
					onclick={() => {
						popGroup();
						input_element?.select();
					}}
					tabindex={-1}
				>
					{selected_group.option.label}:
				</button>
			{/if}
			<input
				bind:this={input_element}
				placeholder={parent ? '' : 'Search'}
				type="text"
				bind:value={query}
				onkeydown={event => handle_keyboard_event(event, {
					'Enter': current_option ? selectCurrentOption : undefined,
					'Backspace': selected_group && query.length === 0 ? clear : undefined,
					'Escape': event.shiftKey
						? closeDialog
						: (selected_group || query.length) ? clear : closeDialog,
					'Tab': current_option ? showAllActions : undefined,
				})}
			/>
		</search>
		<hr />
	</header>
	{#if filtered_options.length}
		<DialogContent>
			<SelectList
				controlled_by={input_element}
				options={filtered_options}
				option_icon={option => option.icon}
				option_value={option => option.label}
				option_kbd={option => getKbd(option)}
				option_details={option => getState(option)}
				virtualized
				on_activate={option => current_option = option}
				on_select={option => select(option)}
			/>
		</DialogContent>
	{/if}
	<DialogFooter>
		{#if current_option}
			{#if isGroupOption(current_option)}
				<button onclick={selectCurrentOption}>
					{getCaption(current_option)}
					<Kbd key="enter" />
				</button>
			{:else}
				{#if hasMultipleActions(current_option) && !all_actions_visible}
					<button onclick={showAllActions} class="show-all-actions">
						Show all actions
						<Kbd key="tab" />
					</button>
				{/if}

				{#if all_actions_visible}
					{#each getModifierActions(current_option) as { modifier, action } (modifier)}
						<button disabled={isDisabled(action)} onclick={selectCurrentOption}>
							{getCaption(action)}
							<Kbd key={[modifier, 'enter']} />
						</button>
					{/each}

					{@const default_action = getDefaultAction(current_option)}
					<button disabled={isDisabled(default_action)} onclick={selectCurrentOption}>
						{getCaption(default_action)}
						<Kbd key="enter" />
					</button>
				{:else}
					{@const [modified_action, modifiers] = getModifiedAction(current_option)}
					<button disabled={isDisabled(modified_action)} onclick={selectCurrentOption}>
						{getCaption(modified_action)}
						<Kbd key={[...modifiers, 'enter']} />
					</button>
				{/if}
			{/if}
		{/if}
	</DialogFooter>
</Dialog>
