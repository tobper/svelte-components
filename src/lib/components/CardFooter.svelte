<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface CardFooter {
		class?: ClassValue;
		justify?: 'start' | 'end' | 'center' | 'spread' | 'stretch';
		children: Snippet;
	}

	let {
		class: class_name,
		justify = 'end',
		children
	}: CardFooter = $props();
</script>

<footer class={['card-footer', class_name, {
	'card-footer--justify-start': justify === 'start',
	'card-footer--justify-end': justify === 'end',
	'card-footer--justify-center': justify === 'center',
	'card-footer--justify-spread': justify === 'spread',
	'card-footer--justify-stretch': justify === 'stretch',
}]}>
	<hr>
	{@render children()}
</footer>
