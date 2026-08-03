<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import Kbd from './Kbd.svelte';
	import { is_snippet } from '$lib/snippets';

	export interface ListItemContentProps {
		/** Icon displayed left of the content */
		icon?: Component | Snippet;
		/** Text for list item */
		label: string;
		/** Keyboard shortcut for action */
		kbd?: string | string[];
		/** Content displayed under the text */
		details?: Component | Snippet | string;
		/** Content displayed under the text */
		children?: Snippet;
	}

	let {
		icon,
		label,
		kbd,
		details,
		children,
	}: ListItemContentProps = $props();
</script>

<div class="list-item__content">
	<header>
		{#if icon}
			<div class="list-item__icon">
				{#if is_snippet(icon)}
					{@render icon()}
				{:else}
					{@const Icon = icon}
					<Icon />
				{/if}
			</div>
		{/if}

		<div class="list-item__label text-truncate">
			{label}
		</div>
	</header>

	{#if kbd}
		<div class="list-item__kbd">
			<Kbd key={kbd} />
		</div>
	{/if}

	{#if details}
		<div class="list-item__details">
			{#if typeof details === 'string'}
				{details}
			{:else if is_snippet(details)}
				{@render details()}
			{:else}
				{@const Details = details}
				<Details />
			{/if}
		</div>
	{:else if children}
		<div class="list-item__details">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.list-item__content {
		display: grid;
		grid-template-areas: "icon text kbd";
		grid-template-columns: auto 1fr auto;

		&:has(.list-item__details:not(:empty)) {
			grid-template-areas:
				"icon text     kbd"
				"icon children _";

			.list-item__icon {
				place-self: start;
				margin-top: var(--space__tiny);
			}

			.list-item__details {
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

	.list-item__label {
		grid-area: text;
		align-self: center;
	}

	.list-item__kbd {
		grid-area: kbd;
		align-self: center;
		margin-left: var(--space);
	}

	.list-item__details:empty {
		display: none;
	}
</style>
