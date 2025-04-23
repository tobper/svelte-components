<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import { get_list_context } from './List.svelte';
	import ListItemContent, { type ListItemContentProps } from './ListItemContent.svelte';

	interface ListItemOption extends ListItemContentProps {
		id?: string;
		class?: ClassValue;
		contrast?: boolean;
		current?: boolean;
		selected?: boolean;
		on_activate?: () => void;
		on_deactivate?: () => void;
		on_select?: () => void;
	}

	let {
		id = $bindable(unique_id()),
		contrast = false,
		current = $bindable(false),
		selected = false,
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
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li
	{id}
	aria-current={current ? true : undefined}
	aria-selected={selected ? true : undefined}
	class={['list-item-option', li_class]}
	class:contrast
	onclick={() => on_select?.()}
	onmouseover={() => {
		current = true;
		on_activate?.()
	}}
	onmouseout={() => {
		current = false;
		on_deactivate?.()
	}}
	role="option"
	tabindex={list.focusable ? (current ? 0 : -1) : undefined}
>
	<ListItemContent {children} {icon} {kbd} {text} /> 
</li>
