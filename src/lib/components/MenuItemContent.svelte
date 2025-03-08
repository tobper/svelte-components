<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface MenuItemContentProps {
		/**  */
		description?: string;
		/** Icon displayed left of the content */
		icon?: Snippet;
		/** Keyboard shortcut for action */
		meta?: Snippet | string;
		/** Text for menu item */
		text: string;
	}

	let {
		description,
		icon,
		meta,
		text,
	}: MenuItemContentProps = $props();
</script>

{#if icon}
	<div class="menu-item-icon">
		{@render icon()}
	</div>
{/if}

<div class="menu-item-text">
	{text}

	{#if description}
		<p>
			{description}
		</p>
	{/if}
</div>

{#if meta}
	<div class="menu-item-meta">
		{#if typeof meta === 'string'}
			{meta}
		{:else}
			{@render meta()}
		{/if}
	</div>
{/if}
