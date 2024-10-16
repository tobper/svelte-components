<script lang="ts">
	import { get_form_context } from './Form.svelte';

	const form = get_form_context();
	let { error } = $derived(form);
</script>

{#if error}
	<p class="form-error">
		{error}
	</p>
{/if}
