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
		<circle pathLength="100"></circle>
		<rect pathLength="100"></rect>

		<!-- <path class="button-border-left-edge"  -->
	</svg>
{/if}
