<script lang="ts">
	import { getTransition, type TransitionValue } from '$lib/animations.js';
	import { on_hover } from '$lib/attachments/on_hover.js';
	import { on } from '$lib/html.js';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import ListItemContent, { type ListItemContentProps } from './ListItemContent.svelte';
	import { get_list_context } from './list_context.js';

	interface ListItemOption extends ListItemContentProps {
		id?: string;
		class?: ClassValue;
		indent?: number;
		content?: Snippet;
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
		class: class_name,
		indent,
		content,
		contrast = false,
		current = false,
		disabled = false,
		selected = false,
		transition: transition_input,
		on_activate,
		on_deactivate,
		on_select,

		// ListItemContent
		icon,
		label,
		kbd,
		details,
		children,

		...attachments
	}: ListItemOption = $props();
	let list = get_list_context();
	let transition = $derived(getTransition(transition_input));
</script>

<li
	{id}
	aria-current={current ? true : undefined}
	aria-disabled={disabled ? true : undefined}
	aria-selected={selected ? true : undefined}
	class={['list-item-option', { contrast }, class_name]}
	role="option"
	tabindex={list?.focusable ? (current ? 0 : -1) : undefined}
	transition:transition
	style:--list-item__indent={indent}
	{@attach !disabled && on({
		click: () => on_select?.(),
	})}
	{@attach !disabled && on_hover(
		() => on_activate?.(),
		() => on_deactivate?.(),
	)}
	{...attachments}
>
	{#if content}
		{@render content()}
	{:else}
		<ListItemContent {icon} {label} {kbd} {details} {children} />
	{/if}
</li>
