<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import CheckButton from './forms/CheckButton.svelte';
	import { get_layout_context } from './Layout.svelte';

	interface SidebarToggleButton {
		animation?: ComponentProps<typeof CheckButton>['animation'];
		content: ComponentProps<typeof CheckButton>['content'];
		text?: string;
		type?: ComponentProps<typeof CheckButton>['type'];
	}

	let {
		animation = 'rotate',
		content,
		text,
		type = 'plain',
	}: SidebarToggleButton = $props();

	let layout = get_layout_context();
</script>

<CheckButton
	{animation}
	{content}
	{text}
	{type}
	bind:checked={layout.sidebar_visible}
/>
