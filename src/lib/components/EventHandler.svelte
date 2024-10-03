<script lang="ts">
	import { get_element } from '../html.js';

	interface EventHandler {
		element: HTMLElement | string | undefined;
		onclick?: HTMLElement['onclick'];
		onkeydown?: HTMLElement['onkeydown'];
	}

	let {
		element: element_or_selector,
		onclick,
		onkeydown,
	}: EventHandler = $props();

	$effect(() => {
		const element = element_or_selector && get_element(element_or_selector);
		if (element && onclick) {
			element.addEventListener('click', onclick);
			return () => element.removeEventListener('click', onclick);
		}
	});

	$effect(() => {
		const element = element_or_selector && get_element(element_or_selector);
		if (element && onkeydown) {
			element.addEventListener('keydown', onkeydown);
			return () => element.removeEventListener('keydown', onkeydown);
		}
	});
</script>
