<script lang="ts">
	import { device } from '$lib/device.js';
	import type { Snippet } from 'svelte';

	interface Device {
		children: Snippet;
		mobile?: boolean;
		tablet?: boolean;
		desktop?: boolean;
		landscape?: boolean;
		portrait?: boolean;
		mouse?: boolean;
		touch?: boolean;
	}

	let {
		children,
		mobile,
		tablet,
		desktop,
		landscape,
		portrait,
		mouse,
		touch,
	}: Device = $props();

	let visible = $derived(
		(mobile === undefined || mobile === device.mobile) &&
		(tablet === undefined || tablet === device.tablet) &&
		(desktop === undefined || desktop === device.desktop) &&
		(mouse === undefined || mouse === device.mouse) &&
		(touch === undefined || touch === device.touch) &&
		(landscape === undefined || landscape === device.landscape) &&
		(portrait === undefined || portrait === device.portrait)
	);
</script>

{#if visible}
	{@render children()}
{/if}
