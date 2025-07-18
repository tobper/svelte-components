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
	import type { ClassValue } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import { anchor } from './anchor.js';
	import { menu_handlers } from './menu.js';
	import { popover } from './popover.js';

	interface Menu {
		id?: string;
		/**
		 * Animation to trigger when opening and closing menu.
		 */
		animation?: 'fade' | 'slide';
		/**
		 * Class to apply to the menu element.
		 */
		class?: ClassValue;
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
</script>

<div
	use:anchor={{
		anchor: trigger,
		match_width: width === 'anchor',
	}}
	use:menu_handlers={{
		trigger
	}}
	use:popover={{
		animation,
		modal,
		visible
	}}
	ontoggle={event => {
		visible = event.newState === 'open';

		if (!visible)
			on_close?.();
		else
			on_open?.();
	}}
	popover="auto"
>
	<div
		{...element_props}
		{id}
		class={['menu', menu_class]}
		role="menu"
		tabindex="-1"
	>
		{@render children()}
	</div>
</div>
