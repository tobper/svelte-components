<script lang="ts">
	import CheckButton from '$lib/components/CheckButton.svelte';
	import { get_layout_context } from '$lib/components/Layout.svelte';
	import type { ComponentProps } from 'svelte';

	interface SidebarToggleButton {
		animation?: ComponentProps<CheckButton>['animation'];
		content: ComponentProps<CheckButton>['content'];
		type?: ComponentProps<CheckButton>['type'];
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
