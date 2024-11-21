<script lang="ts">
	import { type Snippet } from 'svelte';
	import { classes } from '../classes.js';
	import { get_style, set_style } from '../css.js';
	import { get_element } from '../html.js';
	import { unique_id } from '../unique_id.js';

	interface Menu {
		id?: string;
		anchor: string | HTMLElement;
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
		 * Callback is called when menu is closed by this component,
		 * not when visible is changed from the outside.
		 */
		on_close?: () => void;
		onkeydown?: HTMLElement['onkeydown'];
		onmouseover?: HTMLElement['onmouseover'];
		onmouseout?: HTMLElement['onmouseout'];
	}

	let {
		id = $bindable(unique_id()),
		anchor,
		class: menu_class,
		element = $bindable(),
		modal = false,
		visible = $bindable(false),
		width,
		children,
		on_close,
		...dialog_props
	}: Menu = $props();
	let anchor_name = $state<string>();

	$effect(() => {
		const anchor_element = get_element(anchor);
		anchor_name = get_style(anchor_element, 'anchor-name');

		if (anchor_name === 'none') {
			anchor_name = `--${unique_id()}`;
			set_style(anchor_element, 'anchor-name', anchor_name);
		}

		const anchor_positioning_supported = 'anchorName' in document.documentElement.style;
		if (!anchor_positioning_supported) {
			import('@oddbird/css-anchor-positioning/fn')
				.then(({ default: polyfill }) => {
					polyfill({
						// elements: [anchor_element, element!],
						// excludeInlineStyles: true
					});
				});
		}
	});

	$effect(() => {
		if (visible)
			element!.showPopover();
		else
			element!.hidePopover();
	});

	function close() {
		on_close?.();
		visible = false;
	}
</script>	

<div
	bind:this={element}
	{...dialog_props}
	{id}
	class={classes('menu', menu_class)}
	class:match-anchor-width={width === 'anchor'}
	class:modal
	role="menu"
	popover="manual"
	tabindex="-1"
	style:position-anchor={anchor_name}
	onkeydown={event => {
		switch (event.key) {
			case 'Escape':
				close();
				break;
		}
	}}
>
	{@render children()}
</div>
