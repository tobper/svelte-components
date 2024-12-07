<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface ListItemContentProps {
		/** Content displayed under the text */
		children?: Snippet;
		/** Keyboard shortcut for action */
		kbd?: string;
		/** Text for list item */
		text: string;
		/** Icon displayed left of the content */
		icon?: Snippet;
	}

	let {
		kbd,
		text,
		children,
		icon,
	}: ListItemContentProps = $props();
</script>

<div class="list-item__content">
	<header>
		{#if icon}
			<div class="list-item__icon">
				{@render icon()}
			</div>
		{/if}

		<div class="list-item__text">
			{text}
		</div>
	</header>

	{#if kbd}
		<div class="list-item__kbd">
			{kbd}
		</div>
	{/if}

	{#if children}
		<div class="list-item__children">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.list-item__content {
		display: grid;
		grid-template-areas:
			"icon text     kbd"
			"x    children y";
		grid-template-columns: auto 1fr auto;
	}

	header {
		display: contents;
	}

	.list-item__icon {
		grid-area: icon;
		margin-right: var(--space__medium);

		/* Remove white space around icon */
		display: flex;
	}

	.list-item__text {
		grid-area: text;
		
	}

	.list-item__kbd {
		grid-area: kbd;
		margin-left: var(--space);
	}

	.list-item__children {
		grid-area: children;
	}
</style>
