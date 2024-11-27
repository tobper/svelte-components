<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ListItemLink {
		current?: boolean;
		href: string;
		text: string;
		children?: Snippet;
		icon?: Snippet;
	}

	let {
		current = false,
		href,
		text,
		children,
		icon,
	}: ListItemLink = $props();
</script>

<li class="list-item-link">
	<a
		aria-current={current ? 'page' : undefined}
		class="link"
		{href}
	>
		<header>
			{#if icon}
				<div class="list-item-link__icon">
					{@render icon()}
				</div>
			{/if}

			<div class="list-item-link__text">
				{text}
			</div>
		</header>

		{#if children}
			<div class="list-item-link__subtext">
				{@render children?.()}
			</div>
		{/if}
	</a>
</li>

<style>
	a {
		display: grid;
		grid-template-areas:
			"icon text"
			"_ sub_text";
		grid-template-columns: auto 1fr;
	}

	header {
		display: contents;
	}

	.list-item-link__icon {
		grid-area: icon;
		margin-right: var(--space__small);

		/* Remove white space around icon */
		display: flex;
	}

	.list-item-link__text {
		grid-area: text;
	}

	.list-item-link__subtext {
		grid-area: sub_text;
	}
</style>
