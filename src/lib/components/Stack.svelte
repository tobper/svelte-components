<script lang="ts">
	import { reactive_value, type ReactiveBoolean } from '$lib/reactivity.svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Stack {
		children: Snippet;
		class?: ClassValue;
		align?: 'start' | 'end' | 'center' | 'stretch';
		justify?: 'start' | 'end' | 'center' | 'spread' | 'stretch';
		gap?: boolean | 'none' |  'tiny' | 'small' | 'medium' | 'default' | 'large'
		horizontal?: ReactiveBoolean;
		reversed?: ReactiveBoolean;
		wrap?: ReactiveBoolean;
	}

	let {
		children,
		class: element_class,
		align = 'stretch',
		justify = 'start',
		gap = true,
		horizontal = false,
		reversed = false,
		wrap = false,
	}: Stack = $props();
</script>

<div class={['stack', element_class, {
	'gap': gap === 'default' || gap === true,
	'gap-tiny': gap === 'tiny',
	'gap-small': gap === 'small',
	'gap-medium': gap === 'medium',
	'gap-large': gap === 'large',

	'stack--align-start': align === 'start',
	'stack--align-end': align === 'end',
	'stack--align-center': align === 'center',
	'stack--align-stretch': align === 'stretch',

	'stack--justify-start': justify === 'start',
	'stack--justify-end': justify === 'end',
	'stack--justify-center': justify === 'center',
	'stack--justify-spread': justify === 'spread',
	'stack--justify-stretch': justify === 'stretch',

	'stack--horizontal': reactive_value(horizontal),
	'stack--vertical': !reactive_value(horizontal),
	'stack--reversed': reactive_value(reversed),

	'stack--wrap': reactive_value(wrap),
}]}>
	{@render children()}
</div>

<style>
	.stack {
		display: flex;
	}

	.stack--align-start {
		align-items: start;
	}

	.stack--align-end {
		align-items: end;
	}

	.stack--align-center {
		align-items: center;
	}

	.stack--align-stretch {
		align-items: stretch;
	}

	.stack--justify-start {
		justify-content: start;
	}

	.stack--justify-end {
		justify-content: end;
	}

	.stack--justify-center {
		justify-content: center;
	}

	.stack--justify-spread {
		justify-content: space-between;
	}

	.stack--justify-stretch {
		justify-content: stretch;
	}

	.stack--horizontal {
		&.stack--reversed {
			flex-direction: row-reverse;
		}
	}

	.stack--vertical {
		flex-direction: column;

		&.stack--reversed {
			flex-direction: column-reverse;
		}
	}

	.stack--wrap {
		flex-wrap: wrap;
	}
</style>
