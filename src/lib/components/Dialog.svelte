<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Dialog {
		header?: string;
		visible?: boolean;
		children: Snippet;
		footer?: Snippet;
		on_open?: () => void;
		on_close?: () => void;
	}

	let {
		header,
		visible = $bindable(false),
		children,
		footer,
		on_open,
		on_close,
	}: Dialog = $props();
	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (visible) {
			on_open?.();
			dialog!.showModal();
		}
		else {
			dialog!.close();
		}
	});
</script>

<dialog
	bind:this={dialog}
	class="dialog"
	onclose={() => {
		visible = false;
		on_close?.();
	}}
>
	{#if header}
		<header>
			<h3>{header}</h3>
		</header>
	{/if}

	{@render children()}

	{#if footer}
		<footer>
			{@render footer()}
		</footer>
	{/if}
</dialog>
