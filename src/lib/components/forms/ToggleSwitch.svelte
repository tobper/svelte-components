<script lang="ts">
    import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
    import { unique_id } from '../../unique_id.js';
    import Stack from '../Stack.svelte';

	interface ToggleSwitch {
		id?: string;
		class?: ClassValue;
		label?: string;
		description?: string;
		name?: string;
		checked?: boolean;
		direction?: 'normal' | 'reversed';
		disabled?: boolean;
		onchange?: HTMLInputAttributes['onchange'];
		onclick?: HTMLInputAttributes['onclick'];
		on_checked?: (checked: boolean) => void;
	}

	let {
		id = $bindable(unique_id()),
		class: class_name,
		label,
		description,
		checked = $bindable(false),
		direction = 'normal',
		on_checked,
		...input_props
	}: ToggleSwitch = $props();
</script>

{#if label}
	<label class={class_name} class:reversed={direction === 'reversed'}>
		{@render input()}
		{#if description}
			<Stack gap="tiny" >
				<span>{label}</span>
				<p>{description}</p>
			</Stack>
		{:else}
			<span>{label}</span>
		{/if}
	</label>
{:else}
	{@render input()}
{/if}

{#snippet input()}
	<input
		bind:checked
		{...input_props}
		{id}
		class={label ? undefined : class_name}
		type="checkbox"
		onchange={event => {
			on_checked?.(checked);
			input_props.onchange?.(event);
		}}
	>
{/snippet}

<style>
	label {
		/* Content */
		display: inline-flex;
		column-gap: var(--space);
		align-items: start;

		&.reversed {
			flex-direction: row-reverse;
		}

		span {
			line-height: 1.25rem;
		}

		input {
			flex: none;
		}

		/* Interaction */
		user-select: none;
	}

	label:has(:enabled) {
		cursor: pointer;
	}

	input {
		--toggle__height: 1.25rem;
		--toggle__background: var(--field__background, var(--palette__background));
		--toggle__offset: calc(var(--toggle__height) * -1);
		--toggle__shadow: var(--toggle__offset) 0 0 2px var(--toggle__background) inset;

		/* Layout */
		height: var(--toggle__height);
		width: calc(var(--toggle__height) * 2);

		/* Appearance */
		appearance: none;
		background-color: var(--palette__neutral);
		border-radius: 9999px;
		box-shadow:
			var(--field__shadow, 0 0 #0000),
			var(--toggle__shadow),
			0 0 0 2px var(--toggle__background) inset,
			var(--toggle__focus-shadow, 0 0 #0000);

		transition:
			background var(--field__transition-duration) ease-out,
			box-shadow var(--field__transition-duration) ease-out;

		/* Interaction */
		cursor: default;

		&:enabled {
			cursor: pointer;
		}
	}
 
	input:checked {
		--toggle__background: var(--palette__accent-color--bright);
		--toggle__offset: var(--toggle__height);

		background-color: var(--palette__accent-color);
	}
 
	input:focus-visible {
		--toggle__focus-shadow: var(--shadow__focus);
	}
</style>
