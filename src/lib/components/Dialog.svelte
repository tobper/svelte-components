<script lang="ts">
	import { get_root_style } from '$lib/css';
	import { try_parse_milliseconds } from '$lib/time';
	import { type Snippet } from 'svelte';
	import { classes } from '../classes';
	import DialogContent from './DialogContent.svelte';
	import DialogFooter from './DialogFooter.svelte';
	import DialogHeader from './DialogHeader.svelte';

	interface Dialog {
		class?: string;
		header?: string;
		visible?: boolean;
		width?: string;
		children?: Snippet;
		content?: Snippet;
		footer?: Snippet;
		on_open?: () => void;
		on_close?: () => void;
		on_closed?: () => void;
	}

	let {
		class: dialog_class,
		header,
		visible = $bindable(false),
		width,
		children,
		content,
		footer,
		on_open,
		on_close,
		on_closed,
	}: Dialog = $props();
	let on_closed_timer: ReturnType<typeof setTimeout> | null = null;
	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (visible) {
			if (on_closed_timer)
				clearTimeout(on_closed_timer);

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
	class={classes('dialog', dialog_class)}
	style:width
	onclose={() => {
		on_close?.();
		visible = false;

		if (on_closed) {
			const animation_duration =
				(try_parse_milliseconds(get_root_style('--layout__zoom-delay')) ?? 0 ) +
				(try_parse_milliseconds(get_root_style('--layout__zoom-duration')) ?? 0);

			on_closed_timer = setTimeout(on_closed, animation_duration);
		}
	}}
>
	{#if header}
		<DialogHeader text={header} />
	{/if}

	{#if content}
		<DialogContent>
			{@render content()}
		</DialogContent>
	{:else if children}
		{@render children()}
	{/if}

	{#if footer}
		<DialogFooter>
			{@render footer()}
		</DialogFooter>
	{/if}
</dialog>
