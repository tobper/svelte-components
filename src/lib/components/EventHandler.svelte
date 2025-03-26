<script lang="ts">
	import { get_element, on, type ElementReference } from '../html.js';

	interface EventHandler {
		element: ElementReference | undefined;
		onclick?: HTMLElement['onclick'];
		onkeydown?: HTMLElement['onkeydown'];
	}

	let {
		element: element_reference,
		onclick,
		onkeydown,
	}: EventHandler = $props();

	const element = $derived(
		element_reference
			? get_element(element_reference)
			: undefined
	);

	$effect(() => {
		if (!element || !onclick)
			return;

		return on(element, {
			'click': onclick
		});
	});

	$effect(() => {
		if (!element || !onkeydown)
			return;

		return on(element, {
			'keydown': onkeydown
		});
	});
</script>
