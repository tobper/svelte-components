<script lang="ts">
	import { onMount } from 'svelte';
	import { get_element } from '../html.js';

	interface EventHandler {
		element: HTMLElement | string | undefined;
		onclick: HTMLElement['onclick'];
	}

	let {
		element: element_selector,
		onclick
	}: EventHandler = $props();
	let remove_click_handler: (() => void) | undefined;

	$effect(() => {
		remove_click_handler?.();
		remove_click_handler = undefined;

		if (element_selector && onclick) {
			const element = get_element(element_selector);
			element.addEventListener('click', onclick);
			remove_click_handler = () => element.removeEventListener('click', onclick);
		}
	});

	onMount(() => {
		return function destroy() {
			remove_click_handler?.();
		}
	});
</script>
