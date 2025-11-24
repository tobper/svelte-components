<script lang="ts">
	import type { Snippet } from 'svelte';
	import { type Variant } from './Theme.svelte';

	type VariantCallback = (index: number) => Variant;

	interface Carousel {
		children: Snippet;
		markers?: number;
		marker_variant?: Variant | VariantCallback;
		visible_page?: number;
	}

	let {
		children,
		markers = 0,
		marker_variant: marker_variant_input,
		visible_page = $bindable()
	}: Carousel = $props();

	const marker_variant = $derived<VariantCallback>(
		(typeof marker_variant_input === 'function')
			? marker_variant_input
			: marker_variant_input
				? () => marker_variant_input
				: () => 'Primary'
	);
</script>

<div
	class="carousel-container"
	style:--marker-count={markers}
	style:timeline-scope={
		Array
			.from({ length: markers }, (_, i) => `--carousel-page-${i + 1}`)
			.concat('--carousel-timeline')
			.join(',')
	}
>
	<div
		class="carousel"
		{@attach element => {
			// Behavior should be instant the first time the element is created
			// Whenever visible page changes after that it should be smooth
			let behavior: ScrollIntoViewOptions['behavior'] = 'instant'

			$effect(() => {
				if (visible_page !== undefined) {
					const page = element.children[visible_page];
					if (page)
						page.scrollIntoView({ behavior });

					// Reset visible page so that it is possible to set it to the
					// same value again after the user has scrolled manually
					visible_page = undefined
				}

				behavior = 'smooth';
			})
		}}
	>
		{@render children()}
	</div>

	{#if markers > 0}
		<div class="carousel-markers">
			{#each Array.from({ length: markers }, (_, i) => i) as i (i)}
				<div
					class={`variant-${marker_variant(i).toLowerCase()}`}
					style:animation-timeline={`--carousel-page-${i + 1}`}
					style:translate={`${175 * i}%`}
				></div>
			{/each}
		</div>
	{/if}
</div>
