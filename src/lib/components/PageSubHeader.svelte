<script lang="ts">
	import { type Snippet } from 'svelte';
	import { classes } from '../classes';

	interface PageHeader {
		class?: string;
		emphasis?: boolean;
		text?: string;
		sub_text?: string;
		children?: Snippet;
	}

	let {
		class: header_class,
		emphasis = false,
		text,
		sub_text,
		children,
	}: PageHeader = $props();
</script>

<header class={classes('page-sub-header', header_class, { 'variant-secondary': emphasis })}>
	<div class="text">
		<h3 class={{ emphasis }}>
			{text}
		</h3>

		{#if sub_text}
			<div>
				{sub_text}
			</div>
		{/if}
	</div>

	{#if children}
		<div class="flow-items">
			{@render children()}
		</div>
	{/if}
</header>

<style>
	.sub_text {
		color: var(--palette__secondary-color);
	}
</style>
