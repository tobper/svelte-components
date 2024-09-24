<script lang="ts">
	import { get_theme } from './Theme.svelte';

	interface ButtonBorder {
		type: 'plain' | 'outlined' | 'cta';
	}

	let theme = get_theme();
	let { type }: ButtonBorder = $props();
</script>

{#if (type === 'cta' || type === 'outlined') && theme.style === 'lines'}
	<svg class="button-border">
		<rect pathLength="100"></rect>
	</svg>
{/if}
