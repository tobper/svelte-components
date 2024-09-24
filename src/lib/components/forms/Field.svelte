<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { classes } from '../../classes.js';
	import { unique_id } from "../../unique_id.js";
	import { get_form_context } from './Form.svelte';

	interface Field {
		content: Snippet<[{
			id: string;
			error_text: string | null;
			errors: string[];
			loading: boolean;
			submitting: boolean;
			readonly: boolean;
		}]>;
		id?: string;
		class?: string;
		error_hint?: boolean;
		element?: HTMLElement;
		name?: string;
		label?: string;
		required?: boolean;
	}

	const form = get_form_context();

	let {
		id = $bindable(unique_id()),
		class: field_class,
		error_hint,
		element = $bindable(),
		label,
		name,
		required = false,
		content,
	}: Field = $props();
	let { field_errors, loading = false, submitting = false } = $derived(form);
	let errors = $derived((name ? field_errors[name] : null) ?? []);
	let error_text = $derived(errors.length ? errors[0] : null);
	let readonly = $derived(loading || submitting);
</script>

<div
	bind:this={element}
	class={classes('field', field_class)}
>
	{#if label}
		<div class="field-label">
			<span>{label}</span>
		
			{#if !required}
				<span class="field-label-optional">(optional)</span>
			{/if}
		</div>
	{/if}

	{@render content({ id, errors, error_text, loading, submitting, readonly })}

	{#if error_hint || error_text}
		<div class="field-error" transition:slide={{ duration: 100 }}>
			{error_text}
		</div>
	{/if}
</div>
