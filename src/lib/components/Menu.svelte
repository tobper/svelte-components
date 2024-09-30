<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { get_style, set_style } from '../css.js';
	import { get_element } from '../html.js';
	import { unique_id } from '../unique_id.js';
	import EventHandler from './EventHandler.svelte';

	interface Menu {
		anchor: string | HTMLElement;
		modal?: boolean;
		trigger?: string | HTMLElement;
		visible?: boolean;
		children: Snippet;
		on_open?: () => void;
		on_close?: () => void;
	}

	let {
		anchor,
		modal = false,
		trigger,
		visible = $bindable(false),
		children,
		on_open,
		on_close
	}: Menu = $props();
	let anchor_name = $state('');
	let dialog: HTMLDialogElement;

	onMount(() => {
		const anchor_element = get_element(anchor);
		const existing_anchor_name = get_style(anchor_element, 'anchor-name');

		if (!existing_anchor_name.startsWith('--')) {
			anchor_name = `--${unique_id()}`;
			set_style(anchor_element, 'anchor-name', anchor_name);
		}
	});

	// $effect(() => {
	// 	const anchor_element = get_element(anchor);
	// 	const existing_anchor_name = get_style(anchor_element, 'anchor-name');

	// 	if (!existing_anchor_name.startsWith('--')) {
	// 		anchor_name = `--${unique_id()}`;
	// 		set_style(anchor_element, 'anchor-name', anchor_name);
	// 	}
	// });

	$effect(() => {
		if (visible) {
			on_open?.();

			if (modal)
				dialog.showModal();
			else
				dialog.show();
		}
		else {
			dialog.close();
		}
	})
</script>	

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
	bind:this={dialog}
	class="menu"
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
