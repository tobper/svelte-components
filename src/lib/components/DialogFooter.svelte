<script lang="ts">
	import type { Snippet } from 'svelte';

	interface DialogFooter {
		children: Snippet;
	}

	let { children }: DialogFooter = $props();
</script>

<footer class="dialog-footer">
	<hr>
	{@render children()}
</footer>
