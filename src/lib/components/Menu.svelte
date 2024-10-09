<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { classes } from '../classes.js';
	import { get_style, set_style } from '../css.js';
	import { get_element } from '../html.js';
	import { unique_id } from '../unique_id.js';
	import AnchorPlugin from './AnchorPlugin.svelte';
	import EventHandler from './EventHandler.svelte';

	interface Menu {
		id?: string;
		anchor: string | HTMLElement;
		class?: string;
		modal?: boolean;
		trigger?: string | HTMLElement;
		visible?: boolean;
		children: Snippet;
		on_open?: () => void;
		on_close?: () => void;
		onmouseover?: HTMLDialogAttributes['onmouseover'];
		onmouseout?: HTMLDialogAttributes['onmouseout'];
	}

	const anchoring_supported = 'anchorName' in document.documentElement.style;

	let {
		id = $bindable(unique_id()),
		anchor,
		class: dialog_class,
		modal = false,
		trigger,
		visible = $bindable(false),
		children,
		on_open,
		on_close,
		...dialog_props
	}: Menu = $props();
	let anchor_name = $state<string>();
	let dialog = $state<HTMLDialogElement>();

	onMount(() => {
		const anchor_element = get_element(anchor);
		const existing_anchor_name = get_style(anchor_element, 'anchor-name');

		if (!existing_anchor_name.startsWith('--')) {
			anchor_name = `--${unique_id()}`;
			set_style(anchor_element, 'anchor-name', anchor_name);
		}
	});

	$effect(() => {
		if (visible) {
			on_open?.();

			if (modal)
				dialog!.showModal();
			else
				dialog!.show();
		}
		else {
			dialog!.close();
		}
	})
</script>	

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	{id}
	{...dialog_props}
	class={classes('menu', dialog_class)}
	style:position-anchor={anchor_name}
	onclick={({ target }) => {
		// Click event on the dialog itself means that the backdrop is clicked,
		// otherwise the target would be a child element.
		if (target === dialog)
			dialog.close();
	}}
	onclose={() => {
		visible = false;
		on_close?.();
	}}
>
	{@render children()}
</dialog>

<EventHandler element={trigger} onclick={() => {
	visible = true;
}} />

{#if !anchoring_supported}
	<AnchorPlugin {anchor} {visible} anchored={dialog} />
{/if}
