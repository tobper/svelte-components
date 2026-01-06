<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from '../Button.svelte';
	import { get_form_context } from './form_context.svelte';

	type ButtonProps = ComponentProps<typeof Button>;

	interface FormSubmitButton {
		autofocus?: boolean;
		class?: ButtonProps['class'];
		disabled?: ButtonProps['disabled'];
		variant?: ButtonProps['variant'];
		icon?: ButtonProps['icon'];
		text?: ButtonProps['text'];
	}

	const form = get_form_context();

	let {
		autofocus,
		disabled = false,
		...button_props
	}: FormSubmitButton = $props();
</script>

<Button
	{...button_props}
	{autofocus}
	loading={form.delayed}
	disabled={!form.can_submit || disabled}
	submit
	type="cta"
/>
