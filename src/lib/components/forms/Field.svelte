<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
	import { slide } from 'svelte/transition';
	import { unique_id } from '../../unique_id.js';
	import { get_form_context } from './form_context.svelte.js';

	interface Field {
		content: Snippet<[{
			content_id: string;
			error_text: string | null;
			errors: string[];
			in_progress: boolean;
			loading: boolean;
			submitting: boolean;
		}]>;
		id?: string;
		class?: ClassValue;
		error_hint?: boolean | 'auto' | 'always' | 'never';
		errors?: string[];
		element?: HTMLElement;
		name?: HTMLInputAttributes['name'];
		label?: string;
		required?: boolean;
	}

	const form = get_form_context();

	let {
		id = $bindable(unique_id()),
		class: field_class,
		error_hint = form.error_hints,
		errors: input_errors = [],
		element = $bindable(),
		label,
		name,
		required = false,
		content,
	}: Field = $props();
	let { in_progress, loading, submitting } = $derived(form);
	let content_id = $derived(`${id}_content`);
	let form_errors = $derived((name && form.field_errors[name]) ?? []);
	let errors = $derived([...input_errors, ...form_errors]);
	let error_text = $derived(errors[0] ?? null);
	let error_visible = $derived(
		error_hint === true ||
		error_hint === 'always' ||
		(error_hint === 'auto' && !!error_text)
	);
</script>

<div
	bind:this={element}
	{id}
	class={['field', field_class]}
>
	{#if label}
		<div class="field-label">
			<label for={content_id}>{label}</label>

			{#if !required}
				<span class="field-label-optional">(optional)</span>
			{/if}
		</div>
	{/if}

	{@render content({ content_id, errors, error_text, in_progress, loading, submitting })}

	{#if error_visible}
		<div class="field-error" transition:slide={{ duration: 100 }}>
			{error_text}
		</div>
	{/if}
</div>
