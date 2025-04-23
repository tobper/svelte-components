<script lang="ts">
	import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
	import { menu_item_handlers } from './menu';
	import { get_menu_context } from './Menu.svelte';
	import type { MenuItemContentProps } from './MenuItemContent.svelte';
	import MenuItemContent from './MenuItemContent.svelte';

	type ContentProps = Omit<MenuItemContentProps, 'icon'>;
	type InputProps = Pick<HTMLInputAttributes, 'disabled'>;

	interface MenuItemOption extends ContentProps, InputProps {
		checked?: boolean | null;
		class?: ClassValue | null;
		disabled?: boolean | null;
		on_check?: (activated: boolean) => void;
		type?: 'single' | 'radio' | null;
	}

	let {
		checked = $bindable(false),
		class: class_name,
		disabled,
		on_check,
		type = 'single',

		// MenuItemContent
		description,
		meta,
		text
	}: MenuItemOption = $props();
	let menu = get_menu_context();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	use:menu_item_handlers={{
		activate() {
			// Do not toggle a radio that is already checked
			if (type === 'single' || !checked) {
				checked = !checked;
				on_check?.(checked);
			}

			menu.close();
		}
	}}
	aria-disabled={disabled ? true : undefined}
	aria-checked={checked ? true : undefined}
	class={['menu-item menu-item-option', class_name]}
	role={
		type === 'radio'
			? 'menuitemradio'
			: 'menuitemcheckbox'
	}
	tabindex={disabled ? undefined : -1}
>
	<MenuItemContent {description} {meta} {text} />
</div>
