<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface ListItemHeading {
		class?: ClassValue;
		children?: Snippet;
		indent?: number;
		label?: string;
	}

	let {
		class: class_name,
		children,
		indent,
		label,
		...attachments
	}: ListItemHeading = $props();
</script>

<li
	class={['list-item-heading', class_name]}
	role="heading"
	aria-level={4}
	style:--list-item__indent={indent}
	{...attachments}
>
	{#if label}
		{label}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</li>
