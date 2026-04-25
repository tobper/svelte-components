<script lang="ts">
	import { getTransition, type TransitionValue } from '$lib/animations.js';
	import { on } from '$lib/html.js';
	import type { ClassValue } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import { get_list_context } from './List.svelte';
	import ListItemContent, { type ListItemContentProps } from './ListItemContent.svelte';

	interface ListItemOption extends ListItemContentProps {
		id?: string;
		class?: ClassValue;
		contrast?: boolean;
		current?: boolean;
		disabled?: boolean;
		selected?: boolean;
		transition?: TransitionValue;
		on_activate?: () => void;
		on_deactivate?: () => void;
		on_select?: () => void;
	}

	let {
		id = $bindable(unique_id()),
		contrast = false,
		current = $bindable(false),
		disabled,
		selected = false,
		transition: transition_input,
		on_activate,
		on_deactivate,
		on_select,
		class: li_class,

		// LisItemContent
		children,
		icon,
		kbd,
		text,
	}: ListItemOption = $props();
	let list = get_list_context();
	let transition = $derived(getTransition(transition_input));

	function handlers(element: HTMLElement) {
		if (disabled)
			return;

		return on(element, {
			click() {
				on_select?.();
			},
			mouseover() {
				current = true;
				on_activate?.();
			},
			mouseout() {
				current = false;
				on_deactivate?.();
			}
		});
	}
</script>

<li
	{id}
	aria-current={current ? true : undefined}
	aria-disabled={disabled ? true : undefined}
	aria-selected={selected ? true : undefined}
	class={['list-item-option', li_class]}
	class:contrast
	role="option"
	tabindex={list.focusable ? (current ? 0 : -1) : undefined}
	transition:transition
	{@attach handlers}
>
	<ListItemContent {children} {icon} {kbd} {text} />
</li>
