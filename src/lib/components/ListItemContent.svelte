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
		grid-template-areas: "icon text kbd";
		grid-template-columns: auto 1fr auto;

		&:has(.list-item__children:not(:empty)) {
			grid-template-areas:
				"icon text     kbd"
				"icon children _";

			.list-item__icon {
				place-self: start;
				margin-top: var(--space__tiny);
			}

			.list-item__children {
				grid-area: children;
			}
		}
	}

	header {
		display: contents;
	}

	.list-item__icon {
		grid-area: icon;
		margin-right: var(--space__medium);

		/* Remove white space around icon */
		display: flex;
		align-items: center;
	}

	.list-item__text {
		grid-area: text;
		align-self: center;
	}

	.list-item__kbd {
		grid-area: kbd;
		align-self: center;
		margin-left: var(--space);
	}

	.list-item__children:empty {
		display: none;
	}
</style>
