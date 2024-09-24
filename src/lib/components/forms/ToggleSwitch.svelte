<script lang="ts">
	import { unique_id } from '../../unique_id.js';

	interface ToggleSwitch {
		id?: string;
		class?: string;
		label: string;
		name?: string;
		checked?: boolean;
		disabled?: boolean;
		onchange?: () => void;
		onclick?: () => void;
	}

	let {
		id = $bindable(unique_id()),
		class: label_class,
		label,
		name,
		checked = $bindable(false),
		disabled = false,
		onchange,
		onclick,
	}: ToggleSwitch = $props();
</script>

<label class={label_class}>
	<input
		bind:checked
		{id}
		{disabled}
		{name}
		{onchange}
		{onclick}
		type="checkbox"
	>
	<span>{label}</span>
</label>

<style>
	label {
		display: inline-flex;
		column-gap: var(--space);
		align-items: center;
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
		cursor: inherit;
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
