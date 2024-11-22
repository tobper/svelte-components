<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from '../Button.svelte';
	import { get_form_context } from './Form.svelte';

	type ButtonProps = ComponentProps<typeof Button>;

	interface FormSubmitButton {
		class?: ButtonProps['class'];
		disabled?: ButtonProps['disabled'];
		variant?: ButtonProps['variant'];
		icon?: ButtonProps['icon'];
		text?: ButtonProps['text'];
	}

	const form = get_form_context();

	let {
		disabled = false,
		...button_props
	}: FormSubmitButton = $props();
</script>

<Button
	{...button_props}
	loading={form.delayed}
	disabled={!form.can_submit || disabled}
	submit
	type="cta"
/>
