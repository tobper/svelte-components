<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import ButtonBorder from './ButtonBorder.svelte';
	import Loading from './Loading.svelte';

	interface Button {
		current?: 'page' | 'step' | 'location' | 'date' | 'time' | true;
		disabled?: boolean;
		focusable?: boolean;
		loading?: boolean;
		small?: boolean;
		submit?: boolean;
		type?: 'plain' | 'outlined' | 'cta';
		variant?: 'primary' | 'secondary' | 'tertiary' | 'delete';

		icon?: Snippet;
		text?: string;

		onclick?: NonNullable<HTMLButtonAttributes['onclick']>;

		// Rest
		class?: HTMLButtonAttributes['class'];
		formaction?: HTMLButtonAttributes['formaction']
	}
	
	let {
		current,
		disabled = false,
		focusable = true,
		loading = false,
		small = false,
		submit = false,
		type = 'plain',
		variant = 'primary',

		icon,
		text,

		onclick,
		...button_props
	}: Button = $props();
</script>

<button
	aria-current={current}
	aria-disabled={disabled || loading ? true : undefined}
	class:button-cta={type === 'cta'}
	class:button-plain={type === 'plain'}
	class:button-outlined={type === 'outlined'}
	class:button--small={small}
	class:variant-secondary={variant === 'secondary'}
	class:variant-tertiary={variant === 'tertiary'}
	class:variant-delete={variant === 'delete'}
	tabindex={focusable ? 0 : -1}
	type={submit ? 'submit' : 'button'}
	onclick={event => {
		if (disabled || loading) {
			event.preventDefault()
			event.stopImmediatePropagation()
		}

		onclick?.(event);
	}}
	{...button_props}
>
	{#if icon}
		{@render icon()}
	{/if}

	{#if text}
		<span>{text}</span>
	{/if}

	{#if loading}
		<Loading bars />
	{/if}

	<ButtonBorder {type} />
</button>
