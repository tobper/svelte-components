<script lang="ts">
	import type { Snippet } from 'svelte';
	import DialogHeader from './DialogHeader.svelte';

	interface DialogContent {
		children: Snippet;
		horizontal?: boolean;
		header?: string;
		fill?: boolean;
	}

	let {
		children,
		horizontal = false,
		header,
		fill = false,
	}: DialogContent = $props();
</script>

{#if header}
	<DialogHeader text={header} />
{/if}

<div
	class="dialog-content" 
	class:dialog-content--horizontal={horizontal}
	class:dialog-content--fill={fill}
>
	{@render children()}
</div>
