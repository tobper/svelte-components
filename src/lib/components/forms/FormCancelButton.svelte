<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from '../Button.svelte';
	import { get_form_context } from './form_context.svelte';

	type ButtonProps = ComponentProps<typeof Button>;

	interface FormCancelButton {
		autofocus?: boolean;
		class?: ButtonProps['class'];
		disabled?: ButtonProps['disabled'];
		icon?: ButtonProps['icon'];
		text?: ButtonProps['text'];
		onclick?: ButtonProps['onclick'];
	}

	const form = get_form_context();

	let {
		autofocus,
		disabled = false,
		text = 'Cancel',
		...button_props
	}: FormCancelButton = $props();
</script>

<Button
	{...button_props}
	{autofocus}
	{text}
	disabled={form.submitting || disabled}
	type="outlined"
/>
