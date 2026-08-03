<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLOlAttributes } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import { set_list_context } from './list_context.js';

	export interface ListProps {
		/** Id of active list item */
		active_item_id?: string | null;
		aria_label?: HTMLOlAttributes['aria-label'];
		children: Snippet;
		class?: ClassValue;
		element?: HTMLElement;
		focusable?: boolean;
		id?: string;
		onclick?: HTMLOlAttributes['onclick'];
		onfocusin?: HTMLOlAttributes['onfocusin'];
		onfocusout?: HTMLOlAttributes['onfocusout'];
		onkeydown?: HTMLOlAttributes['onkeydown'];
		onmouseover?: HTMLOlAttributes['onmouseover'];
		onmouseout?: HTMLOlAttributes['onmouseout'];
	}

	export function focus() {
		const focus_element = active_item_id
			? document.getElementById(active_item_id)
			: element;

		focus_element?.focus({ preventScroll: true });
	}

	let {
		active_item_id = null,
		aria_label,
		children,
		class: list_class,
		element = $bindable(),
		focusable = true,
		id = $bindable(unique_id()),
		...list_props
	}: ListProps = $props();

	set_list_context({
		get focusable() { return focusable; },
	});

	$effect(() => {
		// Ensure effect is triggered when active item changes
		active_item_id; // eslint-disable-line @typescript-eslint/no-unused-expressions

		// Refocus and scroll to active descendant if the list has focus
		if (element?.contains(document.activeElement))
			focus();
	})
</script>

<ol
	bind:this={element}
	{...list_props}
	{id}
	aria-activedescendant={active_item_id}
	aria-label={aria_label}
	class={['list', list_class]}
	role="listbox"
	tabindex={focusable && !active_item_id ? 0 : -1}
>
	{@render children()}
</ol>
