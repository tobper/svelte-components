<script lang="ts">
	import { type Snippet } from 'svelte';
	import { classes } from '../classes.js';
	import { get_style, set_style } from '../css.js';
	import { get_element } from '../html.js';
	import { unique_id } from '../unique_id.js';
	import AnchorPlugin from './AnchorPlugin.svelte';

	interface Menu {
		id?: string;
		/**
		 * Element to anchor the menu to.  
		 * The menu will be positioned near the anchor and sized to at the least the same width as the anchor.
		 */
		anchor: string | HTMLElement;
		/**
		 * Anchor menu to the right side instead of the left.
		 */
		anchor_right?: boolean;
		/**
		 * Animation to trigger when opening and closing menu.
		 */
		animation?: 'fade' | 'slide';
		/**
		 * Class to apply to the menu element.
		 */
		class?: string;
		element?: HTMLElement;
		modal?: boolean;
		visible?: boolean;
		/**
		 * width of the menu can be either the same as anchor or determined by its own content.
		 */
		width?: 'anchor' | 'content';
		children: Snippet;
		/**
		 * Callback is called when menu is closed.
		 */
		on_close?: () => void;
		/**
		 * Callback is called when menu is opened.
		 */
		on_open?: () => void;
		onkeydown?: HTMLElement['onkeydown'];
		onmouseover?: HTMLElement['onmouseover'];
		onmouseout?: HTMLElement['onmouseout'];
	}

	const anchoring_supported = 'anchorName' in document.documentElement.style && false;

	let {
		id = $bindable(unique_id()),
		anchor,
		anchor_right,
		animation = 'fade',
		class: menu_class,
		element = $bindable(),
		modal = false,
		visible = $bindable(false),
		width,
		children,
		on_close,
		on_open,
		...dialog_props
	}: Menu = $props();
	let anchor_name = $state<string>();

	$effect(() => {
		if (anchoring_supported) {
			const anchor_element = get_element(anchor);
			anchor_name = get_style(anchor_element, 'anchor-name');

			if (anchor_name === 'none') {
				anchor_name = `--${unique_id()}`;
				set_style(anchor_element, 'anchor-name', anchor_name);
			}
		}
	});

	$effect(() => {
		element!.togglePopover(visible);
	});
</script>	

<div
	bind:this={element}
	{...dialog_props}
	{id}
	class={classes('menu', menu_class)}
	class:anchor--right={anchor_right}
	class:anchor--target-width={width === 'anchor'}
	class:menu--fade={animation === 'fade'}
	class:menu--slide={animation === 'slide'}
	class:modal
	role="menu"
	popover="auto"
	tabindex="-1"
	style:position-anchor={anchor_name}
	ontoggle={event => {
		visible = event.newState === 'open';

		if (event.newState === 'closed')
			on_close?.();
		else
			on_open?.();
	}}
>
	{@render children()}
</div>

{#if !anchoring_supported}
	<AnchorPlugin {anchor} {anchor_right} anchored={element} {width} />
{/if}
