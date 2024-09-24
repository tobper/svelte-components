<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import CheckButton from './forms/CheckButton.svelte';
	import { get_layout_context } from './Layout.svelte';

	interface SidebarToggleButton {
		animation?: ComponentProps<typeof CheckButton>['animation'];
		content: ComponentProps<typeof CheckButton>['content'];
		type?: ComponentProps<typeof CheckButton>['type'];
	}

	let {
		animation = 'rotate',
		content,
		type = 'plain',
	}: SidebarToggleButton = $props();

	let layout = get_layout_context();
</script>

<CheckButton
	{animation}
	{content}
	{type}
	bind:checked={layout.sidebar_visible}
/>
