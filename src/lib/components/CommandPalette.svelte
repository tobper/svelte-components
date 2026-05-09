<script lang="ts" module>
	import type { Deferred } from '$lib/reactivity.svelte';

	export type CommandPaletteOption<Type> =
		| CommandPaletteActionOption<Type>
		| CommandPaletteGroupOption<Type>;

	export interface CommandPaletteActionOption<Type> {
		type: Deferred<Type>;
		label: string;
		action: Deferred< CommandPaletteAction | CommandPaletteActionGroup>;
	}

	export interface CommandPaletteGroupOption<Type> {
		type: Deferred<Type>;
		label: string;
		children: Deferred<CommandPaletteActionOption<Type>[]>;
		caption?: Deferred<string>;
		state?: Deferred<string>;
	}

	export interface  CommandPaletteAction {
		run(): void;
		name?: string;
		caption?: Deferred<string>;
		state?: Deferred<string>;
		valid?: Deferred<boolean>;
	}

	export interface CommandPaletteActionGroup {
		default:  CommandPaletteAction;
		alt?:  CommandPaletteAction;
		control?:  CommandPaletteAction;
		meta?:  CommandPaletteAction;
		shift?:  CommandPaletteAction;
	}
</script>

<script lang="ts" generics="Type">
	import { getModifierKeys } from '$lib/key_bindings.svelte';
	import { match } from '$lib/match';
	import { create_normalized_lookup } from '$lib/normalization';
	import { tick, untrack, type Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';
	import DialogContent from './DialogContent.svelte';
	import DialogFooter from './DialogFooter.svelte';
	import Kbd from './Kbd.svelte';
	import List from './List.svelte';
	import ListItemOption from './ListItemOption.svelte';

	type Option = CommandPaletteOption<Type>;
	type Action =  CommandPaletteAction;
	type ActionModifier = keyof CommandPaletteActionGroup;
	type ActionOption = CommandPaletteActionOption<Type>;
	type GroupOption = CommandPaletteGroupOption<Type>;

	interface CommandPaletteProps {
		icon: Snippet<[Type]>;
		keys?: (command: string) => string | string[] | undefined;
		options: Option[];
		query?: string;
		visible?: boolean;
	}

	const modifier_keys = getModifierKeys();

	let {
		icon: list_item_icon,
		keys,
		options: root_options,
		query = $bindable(''),
		visible = $bindable(false),
	}: CommandPaletteProps = $props();

	let input_element = $state<HTMLInputElement>();
	let list_element = $state<HTMLElement>();
	let all_actions_visible = $state(false);
	let selected_group = $state<{ query: string; option: GroupOption }>();
	let current_item = $state<{ index: number; option: Option }>();

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
			if (!current_item) {
				if (updated_options.length)
					current_item = { index: 0, option: updated_options[0] };

				return;
			}

			const current_option_label = current_item.option.label;
			let new_index = updated_options.findIndex(o => o.label === current_option_label);

			if (new_index === -1 && updated_options.length)
				new_index = 0

			current_item = new_index >= 0
				? { index: new_index, option: updated_options[new_index] }
				: undefined;
		});
	});

	function createLookup(options: Option[]) {
		return create_normalized_lookup(options, option => option.label);
	}

	function next(direction: 'up' | 'down') {
		if (!current_item)
			return;

		const current_index = current_item.index;
		const index = (current_index + (direction === 'up' ? -1 : 1) + filtered_options.length) % filtered_options.length;

		all_actions_visible = false;
		current_item = { index, option: filtered_options[index] };
		list_element?.children[index].scrollIntoView({ block: 'nearest' });
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
		if (current_item)
			select(current_item.option);
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
		if (!current_item || !isActionOption(current_item.option))
	 		return;

		if (all_actions_visible) {
			all_actions_visible = false;
		} else {
			all_actions_visible = true;

			const { index } = current_item;

			tick().then(() => {
				list_element?.children[index].scrollIntoView({
					block: 'nearest',
					behavior: 'smooth',
				});
			});
		}
	}

	function clear() {
		if (query)
			query = '';
		else
			popGroup();
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

	function getState(option: Option) {
		if (isGroupOption(option))
			return getValue(option.state);

		const [action] = getModifiedAction(option);
		const state = getValue(action.state);

		return state;
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

	function getValue<T>(arg: T | (() => T)) {
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
				autofocus
				placeholder={parent ? '' : 'Search'}
				type="text"
				bind:value={query}
				onkeydown={(event) => {
					const action = match(event.key, {
						ArrowDown: () => next('down'),
						ArrowUp: () => next('up'),
						Enter: current_item ? selectCurrentOption : undefined,
						Backspace: selected_group && query.length === 0 ? clear : undefined,
						Escape: selected_group || query.length ? clear : undefined,
						Tab: current_item ? showAllActions : undefined,
					});

					if (action) {
						event.preventDefault();
						action();
					}
				}}
			/>
		</search>
		<hr />
	</header>
	{#if filtered_options.length}
		<DialogContent>
			<List bind:element={list_element}>
				{#each filtered_options as option, index (option)}
					{@const disabled = isDisabled(option)}
					<ListItemOption
						{disabled}
						class={{ disabled }}
						current={index === current_item?.index}
						text={option.label}
						kbd={getKbd(option)}
						on_activate={() => {
							current_item = { index, option };
						}}
						on_select={() => {
							select(option);
						}}
					>
						{#snippet icon()}
							{@render list_item_icon(getValue(option.type))}
						{/snippet}

						{getState(option)}

						<!-- {#if all_actions_visible && isAction(option) && 'default' in option.action}
		              <div class="all_actions">
		                {#each getModifierActions(option) as { modifier, action } (modifier)}
		                  <div>
		                    {action.title}
		                    <Kbd key={modifier !== 'default' ? [modifier, 'enter'] : 'enter'} />
		                  </div>
		                {/each}
		              </div>
		            {/if} -->
					</ListItemOption>
				{/each}
			</List>
		</DialogContent>
	{/if}
	<DialogFooter>
		{#if current_item}
			{@const option = current_item.option}
			{#if isGroupOption(option)}
				<button onclick={selectCurrentOption}>
					{getCaption(option)}
					<Kbd key="enter" />
				</button>
			{:else}
				{#if hasMultipleActions(option) && !all_actions_visible}
					<button onclick={showAllActions} class="show-all-actions">
						Show all actions
						<Kbd key="tab" />
					</button>
				{/if}

				{#if all_actions_visible}
					{#each getModifierActions(option) as { modifier, action } (modifier)}
						<button disabled={isDisabled(action)} onclick={selectCurrentOption}>
							{getCaption(action)}
							<Kbd key={[modifier, 'enter']} />
						</button>
					{/each}

					{@const default_action = getDefaultAction(option)}
					<button disabled={isDisabled(default_action)} onclick={selectCurrentOption}>
						{getCaption(default_action)}
						<Kbd key="enter" />
					</button>
				{:else}
					{@const [modified_action, modifiers] = getModifiedAction(option)}
					<button disabled={isDisabled(modified_action)} onclick={selectCurrentOption}>
						{getCaption(modified_action)}
						<Kbd key={[...modifiers, 'enter']} />
					</button>
				{/if}
			{/if}
		{/if}
	</DialogFooter>
</Dialog>
