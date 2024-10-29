<script lang="ts">
	import { unique_id } from '../../unique_id.js';

	interface ToggleSwitch {
		id?: string;
		class?: string;
		label?: string;
		name?: string;
		checked?: boolean;
		disabled?: boolean;
		onchange?: () => void;
		onclick?: () => void;
	}

	let {
		id = $bindable(unique_id()),
		class: class_name,
		label,
		checked = $bindable(false),
		...input_props
	}: ToggleSwitch = $props();
</script>

{#if label}
	<label class={class_name}>
		{@render input()}
		<span>{label}</span>
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
	>
{/snippet}

<style>
	label {
		/* Content */
		display: inline-flex;
		column-gap: var(--space);
		align-items: center;

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
		--toggle__shadow: var(--field__shadow, 0 0 #0000);

		/* Layout */
		height: var(--toggle__height);
		width: calc(var(--toggle__height) * 2);
		margin-block: 0.25rem;

		/* Appearance */
		appearance: none;
		background-color: var(--palette__neutral);
		border-radius: 9999px;
		box-shadow:
			var(--toggle__shadow),
			var(--toggle__offset) 0 0 2px var(--toggle__background) inset,
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
		--toggle__focus-shadow: var(--focus__shadow);
	}
</style>
