<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { menu_item_handlers } from './menu';
	import { get_menu_context } from './Menu.svelte';
	import MenuItemContent, { type MenuItemContentProps } from './MenuItemContent.svelte';

	interface MenuItemButton extends MenuItemContentProps {
		class?: ClassValue | null;
		disabled?: boolean | null;
		on_activate: () => void;
	}

	let {
		class: class_name,
		disabled,
		on_activate,

		// MenuItemContent
		description,
		icon,
		meta,
		text
	}: MenuItemButton = $props();
	let menu = get_menu_context();
</script>

<div
	use:menu_item_handlers={{
		activate() {
			on_activate?.();
			menu.close();
		}
	}}
	aria-disabled={disabled ? true : undefined}
	class={['menu-item', class_name]}
	role="menuitem"
	tabindex={disabled ? undefined : -1}
>
	<MenuItemContent {description} {icon} {meta} {text} />
</div>
