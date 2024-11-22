<script lang="ts">
	import { classes } from '../../classes.js';
	import { unique_id } from '../../unique_id.js';

	interface Checkbox {
		checked?: boolean;
		class?: string;
		disabled?: boolean;
		id?: string;
		indeterminate?: boolean;
		invalid?: boolean;
		label?: string;
		name?: string;
		readonly?: boolean;
		onchange?: HTMLInputElement['onchange'];
		onclick?: HTMLInputElement['onclick'];
	}

	let {
		checked = $bindable(false),
		class: class_name,
		id = $bindable(unique_id()),
		indeterminate = $bindable(false),
		invalid,
		label,
		...input_props
	}: Checkbox = $props();
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
		{...input_props}
		{id}
		bind:checked
		bind:indeterminate
		aria-invalid={invalid ? true : undefined}
		class={classes('checkbox', !label && class_name)}
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
</style>
