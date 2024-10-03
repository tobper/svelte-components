<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ListItemHeading {
		children: Snippet;
	}

	let {
		children
	}: ListItemHeading = $props();
</script>

<li role="presentation">
	{@render children()}
</li>
