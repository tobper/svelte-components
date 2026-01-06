<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from './Button.svelte';
	import { get_form_context } from './forms/form_context.svelte';

	type ButtonProps = ComponentProps<typeof Button>;

	interface DialogCloseButton {
		class?: ButtonProps['class'];
		icon?: ButtonProps['icon'];
		text?: ButtonProps['text'];
	}

	const form = get_form_context();

	let {
		...button_props
	}: DialogCloseButton = $props();
</script>

<form method="dialog">
	<Button
		{...button_props}
		disabled={form.submitting}
		type="outlined"
		submit
	/>
</form>

<style>
	form {
		display: contents;
	}
</style>
