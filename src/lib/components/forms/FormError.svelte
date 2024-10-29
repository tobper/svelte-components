<script lang="ts">
	import { get_form_context } from './Form.svelte';

	const form = get_form_context();
	let { error_message } = $derived(form);
</script>

{#if error_message}
	<p class="form-error">
		{error_message}
	</p>
{/if}
