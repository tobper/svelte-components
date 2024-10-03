<script lang="ts" module>
	export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'delete';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { unique_id } from '../unique_id.js';
	import ButtonBorder from './ButtonBorder.svelte';
	import Loading from './Loading.svelte';

	interface Button {
		current?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
		disabled?: boolean;
		focusable?: boolean;
		id?: string;
		loading?: boolean;
		pseudo_focus?: boolean;
		small?: boolean;
		submit?: boolean;
		title?: string;
		type?: 'plain' | 'outlined' | 'cta';
		variant?: ButtonVariant;

		children?: Snippet;
		icon?: Snippet;
		text?: unknown;

		onclick?: HTMLButtonAttributes['onclick'];

		// Rest
		class?: HTMLButtonAttributes['class'];
		formaction?: HTMLButtonAttributes['formaction']
	}
	
	let {
		current,
		disabled = false,
		focusable = true,
		id = $bindable(unique_id()),
		loading = false,
		pseudo_focus = false,
		small = false,
		submit = false,
		type = 'plain',
		variant = 'primary',

		children,
		icon,
		text,

		onclick,
		...button_props
	}: Button = $props();
</script>

<button
	{id}
	aria-current={current === false ? undefined : current}
	aria-disabled={disabled || loading ? true : undefined}
	class:button-cta={type === 'cta'}
	class:button-plain={type === 'plain'}
	class:button-outlined={type === 'outlined'}
	class:button--pseudo-focus={pseudo_focus}
	class:button--round={!!icon && !text}
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
		else {
			onclick?.(event);
		}
	}}
	{...button_props}
>
	{#if icon}
		<span class="button-icon">
			{@render icon()}
		</span>
	{/if}

	{#if children}
		{@render children()}
	{/if}

	{#if text}
		<span>{text}</span>
	{/if}

	{#if loading}
		<Loading bars />
	{/if}

	<ButtonBorder {type} />
</button>
