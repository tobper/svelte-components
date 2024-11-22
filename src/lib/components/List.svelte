<script lang="ts" module>
	import { getContext, setContext } from 'svelte';

	const context_key = Symbol('List');

	export interface ListContext {
		readonly focusable: boolean;
	}

	export function get_list_context() {
		return getContext<ListContext>(context_key);
	}

	function set_context(state: ListContext) {
		return setContext(context_key, state);
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLOlAttributes } from 'svelte/elements';
	import { classes } from '../classes.js';
	import { get_optional_button_element } from '../html.js';
	import { unique_id } from '../unique_id.js';

	interface List {
		/** Id of active list item */
		active_item_id?: string | null;
		aria_label?: HTMLOlAttributes['aria-label'];
		children: Snippet;
		class?: string;
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
		const active_button =
			active_item_id &&
			get_optional_button_element(`#${active_item_id} > button`);

		if (active_button)
			active_button.focus();
		else
			element?.focus();
	}

	let {
		active_item_id = $bindable(null),
		aria_label,
		children,
		class: list_class,
		element = $bindable(),
		focusable = true,
		id = $bindable(unique_id()),
		...list_props
	}: List = $props();

	set_context({
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
	class={classes('select-list variant-primary', list_class)}
	role="listbox"
	tabindex={focusable && active_item_id ? 0 : -1}
>
	{@render children()}
</ol>
