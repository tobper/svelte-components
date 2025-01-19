<script lang="ts" generics="Value">
	import type { ClassValue } from 'svelte/elements';
	import { MediaQuery } from 'svelte/reactivity';
	import { create_digits, type Direction } from './odometer';

	const nbsp = ' ';
	const prefers_reduced_motion = new MediaQuery('prefers-reduced-motion: reduce');

	interface Odometer {
		class?: ClassValue;
		format: (value: Value) => string;
		value: Value;
	}

	let {
		class: class_name,
		format,
		value
	}: Odometer = $props();

	let previous_value = $state<Value>(value);
	let characters = $state<string[]>([]);
	let transitions_running = $state(0);
	let direction = $state<Direction>('up');

	$effect(() => {
		if (prefers_reduced_motion.current)
			previous_value = value;

		if (previous_value === value)
			return;

		direction = value > previous_value ? 'up' : 'down';

		const current_text = format(value).split('').toReversed();
		const previous_text = format(previous_value).split('').toReversed();
		const current_characters =
			Array.from(
				{
					length: Math.max(previous_text.length, current_text.length)
				},
				(_, i) =>
					create_digits(
						direction,
						previous_text[i] ?? nbsp,
						current_text[i] ?? nbsp
					)
			);

		previous_value = value;
		characters = current_characters.toReversed();
		transitions_running = characters.length;
	});
</script>

<div class={['odometer', class_name ]}>
	{#if transitions_running > 0}
		{#key characters}
			{#each characters as digits}
				{@const up = direction === 'up'}
				{@const down = direction === 'down'}

				<div
					class={['digit', { up, down }]}
					ontransitionend={() => transitions_running--}
				>
					{#each digits as digit}
						<span>{digit}</span>
					{/each}
				</div>
			{/each}
		{/key}
	{:else}
		{format(value)}
	{/if}
</div>

<style>
	.odometer {
		--line-height: 1.5em;

		overflow: clip;
		height: var(--line-height);
		display: inline flex;
		vertical-align: top;
		align-items: start;

		/* Ensure characters are rendered the same when inside spans and as part of text (colon for instance) */
		font-variant-ligatures: none;

		/* Ensure all digits are the same width to avoid text expanding/contracting */
		font-variant-numeric: tabular-nums;

		/* Allow for positive/negative transitions */
		transition: color var(--transition__duration--medium);
	}

	.digit {
		display: flex;
		transition: transform var(--transition__duration--medium) cubic-bezier(.165, .84, .44, 1);

		&.up {
			flex-direction: column-reverse;

			@starting-style {
				transform: translateY(calc(-100% + var(--line-height)));
			}
		}

		&.down {
			flex-direction: column;
			transform: translateY(calc(-100% + var(--line-height)));

			@starting-style {
				transform: translateY(0);
			}
		}
	}

	span {
		display: block;
		min-height: var(--line-height);
	}
</style>
