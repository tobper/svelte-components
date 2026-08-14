<script lang="ts">
	import Render, { type Content } from './Render.svelte'

	export interface MenuItemContentProps {
		/**  */
		description?: string
		/** Icon displayed left of the content */
		icon?: Content
		/** Keyboard shortcut for action */
		meta?: Content | string
		/** Text for menu item */
		text: string
	}

	let {
		description,
		icon,
		meta,
		text,
	}: MenuItemContentProps = $props()
</script>

{#if icon}
	<div class="menu-item-icon">
		<Render content={icon} />
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
		<Render content={meta} />
	</div>
{/if}
