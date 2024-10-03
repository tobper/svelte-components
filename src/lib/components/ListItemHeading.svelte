<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ListItemHeading {
		children: Snippet;
	}

	let {
		children
	}: ListItemHeading = $props();
</script>

<li role="heading" aria-level={4}>
	{@render children()}
</li>
