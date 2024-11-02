<script lang="ts">
	import type { Snippet } from 'svelte';
	import { unique_id } from '../unique_id.js';
	import { get_list_context } from './List.svelte';

	interface ListItemOption {
		id?: string;
		class?: string;
		contrast?: boolean;
		current?: boolean;
		selected?: boolean;
		children: Snippet;
		on_activate?: () => void;
		on_deactivate?: () => void;
		on_select?: () => void;
	}

	let {
		id = $bindable(unique_id()),
		contrast = false,
		current = false,
		selected = false,
		children,
		on_activate,
		on_deactivate,
		on_select,
		...li_props
	}: ListItemOption = $props();
	let list = get_list_context();
</script>

<li
	{...li_props}
	{id}
	aria-current={current ? true : undefined}
	aria-selected={selected ? true : undefined}
	class:contrast
	role="option"
>
	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<button
		onclick={() => on_select?.()}
		onmouseover={() => on_activate?.()}
		onmouseout={() => on_deactivate?.()}
		tabindex={list.focusable && current ? 0 : -1}
		type="button"
	>
		{@render children()}
	</button>
</li>
