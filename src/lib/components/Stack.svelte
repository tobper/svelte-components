<script lang="ts">
    import type { Snippet } from 'svelte';

	interface Stack {
		children: Snippet;
		class?: string;
		content?: 'center' | 'normal' | 'spread' | 'stretch';
		gap?: boolean | 'none' |  'tiny' | 'small' | 'medium' | 'default' | 'large'
		horizontal?: boolean;
		reversed?: boolean;
		wrap?: boolean;
	}

	let {
		children,
		class: element_class,
		content = 'normal',
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

	'stack--content-center': content === 'center',
	'stack--content-spread': content === 'spread',
	'stack--content-stretch': content === 'stretch',

	'stack--horizontal': horizontal && !reversed,
	'stack--horizontal-reversed': horizontal && reversed,
	'stack--vertical': !horizontal && !reversed,
	'stack--vertical-reversed': !horizontal && reversed,

	'stack--wrap': wrap,
}]}>
	{@render children()}
</div>

<style>
	.stack {
		display: flex;
	}

	.stack--content-center {
		justify-content: center;
	}

	.stack--content-spread {
		justify-content: space-between;
	}

	.stack--content-stretch {
		justify-content: stretch;
	}

	.stack--horizontal {
		align-items: center;
	}

	.stack--horizontal-reversed {
		align-items: center;
		flex-direction: row-reverse;
	}

	.stack--vertical {
		flex-direction: column;
	}

	.stack--vertical-reversed {
		flex-direction: column-reverse;
	}

	.stack--wrap {
		flex-wrap: wrap;
	}
</style>