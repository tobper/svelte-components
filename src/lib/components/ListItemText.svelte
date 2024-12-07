<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ListItemHeading {
		children: Snippet;
	}

	let {
		children
	}: ListItemHeading = $props();
</script>

<li class="list-item-text" role="presentation">
	{@render children()}
</li>
