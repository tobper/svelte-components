<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import Button from './Button.svelte';
	import { get_list_context } from './List.svelte';

	interface ListItemOption {
		id?: string;
		class?: string;
		contrast?: boolean;
		current?: boolean;
		selected?: boolean;
		children: Snippet;
		onclick?: HTMLButtonAttributes['onclick'];
	}

	let {
		id = $bindable(unique_id()),
		contrast = false,
		current = false,
		selected = false,
		children,
		onclick,
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
	<Button
		{onclick}
		current={selected}
		focusable={list.focusable && current}
		pseudo_focus={!list.focusable && current}
	>
		{@render children()}
	</Button>
</li>
