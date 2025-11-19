<script lang="ts">
	import { get_root_style } from '$lib/css';
	import { try_parse_milliseconds } from '$lib/time';
	import { type Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import DialogContent from './DialogContent.svelte';
	import DialogFooter from './DialogFooter.svelte';
	import DialogHeader from './DialogHeader.svelte';
	import { unique_id } from '$lib/unique_id';

	interface Dialog {
		class?: ClassValue;
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
	let dialog = $state.raw<HTMLDialogElement>();
	let key = $state.raw(unique_id());

	$effect(() => {
		if (visible) {
			// Rerender content when dialog is opened
			// Needed for instance by Carousel that needs to set scroll
			// position which is not possible when content is hidden
			key = unique_id();

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
	class={['dialog', dialog_class]}
	style:width
	onclick={e => {
		if (e.target === e.currentTarget)
		  visible = false;
	}}
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

	{#key key}
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
	{/key}
</dialog>
