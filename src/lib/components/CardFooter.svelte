<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardFooter {
		children: Snippet;
	}

	let { children }: CardFooter = $props();
</script>

<footer class="card-footer">
	<hr>
	{@render children()}
</footer>
