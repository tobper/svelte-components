<script lang="ts">
	import { type Snippet } from 'svelte';
	import { classes } from '../classes';

	interface PageHeader {
		class?: string;
		text?: string;
		children?: Snippet;
	}

	let {
		class: header_class,
		text,
		children,
	}: PageHeader = $props();
</script>

<header class={classes('page-sub-header', header_class)}>
	<h3>
		{text}
	</h3>

	{#if children}
		<div class="flow-items">
			{@render children()}
		</div>
	{/if}
</header>
