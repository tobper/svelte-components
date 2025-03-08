<script lang="ts" module>
	import { getContext, setContext } from 'svelte';

	const context_key = Symbol('Menu');

	export interface MenuContext {
		close(): void;
	}

	export function get_menu_context() {
		return getContext<MenuContext>(context_key);
	}

	function set_menu_context(state: MenuContext) {
		return setContext(context_key, state);
	}
</script>

<script lang="ts">
	import type { ElementReference } from '$lib/html.js';
	import { type Snippet } from 'svelte';
	import { classes } from '../classes.js';
	import { unique_id } from '../unique_id.js';
	import { anchor, anchoring_supported } from './anchor.js';
	import AnchorPlugin from './AnchorPlugin.svelte';
	import { menu_handlers } from './menu.js';

	interface Menu {
		id?: string;
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
		/**
		 * Element to attach the the menu to.  
		 * The menu will be anchored to the trigger and sized to at the least the same width as the trigger.
		 * Click and key handlers will be attached to the trigger.
		 */
		trigger: ElementReference;
	}

	let {
		id = $bindable(unique_id()),
		animation = 'fade',
		class: menu_class,
		element = $bindable(),
		modal = false,
		visible = $bindable(false),
		width,
		children,
		on_close,
		on_open,
		trigger,
		...element_props
	}: Menu = $props();

	set_menu_context({
		close() {
			visible = false;
		}
	})

	$effect(() => {
		element!.togglePopover(visible);
	});
</script>	

<div
	bind:this={element}
	use:anchor={{
		anchor: trigger,
		match_width: width === 'anchor',
	}}
	use:menu_handlers={{
		trigger
	}}
	{...element_props}
	{id}
	class={classes('menu popover', menu_class)}
	class:popover--fade={animation === 'fade'}
	class:popover--slide={animation === 'slide'}
	class:popover--modal={modal}
	role="menu"
	popover="auto"
	ontoggle={event => {
		visible = event.newState === 'open';

		if (event.newState === 'closed')
			on_close?.();
		else
			on_open?.();
	}}
	tabindex="-1"
>
	{@render children()}
</div>

{#if !anchoring_supported && trigger}
	<AnchorPlugin anchor={trigger} {anchor_right} anchored={element} {width} />
{/if}
