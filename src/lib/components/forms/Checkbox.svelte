<script lang="ts">
	import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
	import { unique_id } from '../../unique_id.js';
	import { get_form_context } from './Form.svelte';

	interface Checkbox {
		checked?: boolean;
		class?: ClassValue;
		disabled?: boolean;
		id?: string;
		indeterminate?: boolean;
		invalid?: boolean;
		label?: string;
		name?: HTMLInputAttributes['name'];
		readonly?: boolean;
		onchange?: HTMLInputAttributes['onchange'];
		onclick?: HTMLInputAttributes['onclick'];
	}

	const form = get_form_context();

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
		class={['checkbox', !label && class_name, { skeleton: form.loading }]}
		readonly={form.in_progress}
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
