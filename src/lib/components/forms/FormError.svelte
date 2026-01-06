<script lang="ts">
	import { get_form_context } from './form_context.svelte';

	interface FormError {
		fields?: string[];
	}

	let {
		fields = []
	}: FormError = $props();

	const form = get_form_context();
	let { error_message } = $derived(form);
	let field_errors = $derived(
		fields.flatMap(field => form.field_errors[field] ?? [])
	);
</script>

{#if fields.length}
	{#each field_errors as field_error (field_error)}
		<p class="form-error">
			{field_error}
		</p>
	{/each}
{:else if error_message}
	<p class="form-error">
		{error_message}
	</p>
{/if}
