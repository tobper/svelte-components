<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { unique_id } from '../../unique_id.js';
	import Button from '../Button.svelte';
	import ClearIcon from '../icons/ClearIcon.svelte';
	import Loading from '../Loading.svelte';
	import Field from './Field.svelte';

	interface TextField {
		aria_activedescendant?: HTMLInputAttributes['aria-activedescendant'];
		aria_autocomplete?: HTMLInputAttributes['aria-autocomplete'];
		aria_controls?: HTMLInputAttributes['aria-controls'];
		aria_expanded?: HTMLInputAttributes['aria-expanded'];
		aria_haspopup?: HTMLInputAttributes['aria-haspopup'];
		autocomplete?: HTMLInputAttributes['autocomplete'];
		class?: string;
		field_element?: HTMLElement | undefined;
		field_input_element?: HTMLElement | undefined;
		disabled?: boolean;
		error_hint?: boolean;
		focused?: boolean;
		id?: string;
		input_class?: string;
		input_element?: HTMLInputElement;
		inputmode?: HTMLInputAttributes['inputmode'];
		label?: string;
		list?: HTMLInputAttributes['list'];
		loading?: boolean;
		name?: string;
		placeholder?: HTMLInputAttributes['placeholder'];
		role?: HTMLInputAttributes['role'];
		readonly?: boolean;
		required?: boolean;
		type?: HTMLInputAttributes['type'];
		value?: string;

		onclick?: HTMLInputAttributes['onclick'];
		onkeydown?: HTMLInputAttributes['onkeydown'];
		oninput?: HTMLInputAttributes['oninput'];
		onpaste?: HTMLInputAttributes['onpaste'];
		onselectionchange?: HTMLInputAttributes['onselectionchange'];
		on_clear?: () => void;
		on_focus_in?: () => void;
		on_focus_out?: () => void;

		children?: Snippet;
		icon?: Snippet;
		prefix?: Snippet;
		suffix?: Snippet;
	}

	let {
		aria_activedescendant,
		aria_autocomplete,
		aria_controls,
		aria_expanded,
		aria_haspopup,
		autocomplete = 'off',
		class: field_class,
		field_element = $bindable(),
		field_input_element = $bindable(),
		disabled = false,
		error_hint = false,
		focused = $bindable(false),
		id = $bindable(unique_id()),
		input_class,
		input_element = $bindable(),
		inputmode,
		label,
		list,
		loading: input_loading = false,
		name,
		placeholder,
		role,
		readonly = false,
		required = false,
		type = 'text',
		value = $bindable(''),

		onclick,
		oninput,
		onkeydown,
		onpaste,
		onselectionchange,
		on_clear,
		on_focus_in,
		on_focus_out,

		children,
		icon,
		prefix,
		suffix,
	}: TextField = $props();

	export function blur() {
		input_element?.blur()
	}

	export function focus() {
		input_element?.focus()
	}

	let children_element = $state<HTMLElement>();
	let label_id = unique_id();
</script>

<Field
	bind:element={field_element}
	{error_hint}
	{id}
	{label}
	{name}
	{required}
	class={field_class}	
>
	{#snippet content({ content_id, error_text, loading, in_progress })}
		<div bind:this={field_input_element} class="field-input">
			{#if prefix}
				{@render prefix()}
			{/if}

			<div class="field-input-text" class:skeleton={loading}>
				{@render input(content_id, error_text, in_progress)}
				{@render clear_button()}
				{@render field_icon()}
				{@render field_loading()}
			</div>

			{#if suffix}
				{@render suffix()}
			{/if}
		</div>

		{#if children && !in_progress}
			<div bind:this={children_element}>
				{@render children()}
			</div>
		{/if}
	{/snippet}
</Field>

{#snippet input(content_id: string, error_text: string | null, in_progress: boolean)}
	<input
		{autocomplete}
		{disabled}
		{inputmode}
		{list}
		{name}
		{placeholder}
		{required}
		{role}
		{type}
		bind:this={input_element}
		bind:value
		aria-activedescendant={aria_activedescendant}
		aria-autocomplete={aria_autocomplete}
		aria-controls={aria_controls}
		aria-expanded={aria_expanded ? true : undefined}
		aria-haspopup={aria_haspopup ? true : undefined}
		aria-invalid={error_text ? true : undefined}
		aria-labelledby={label_id}
		class={input_class}
		id={content_id}
		readonly={in_progress || readonly}
		{onclick}
		{oninput}
		{onkeydown}
		{onpaste}
		{onselectionchange}
		onfocusin={() => {
			if (focused)
				return;

			focused = true
			on_focus_in?.();
		}}
		onfocusout={event => {
			const { relatedTarget } = event;
			const input_or_children_focused =
				relatedTarget instanceof Element &&
				(field_input_element!.contains(relatedTarget) || children_element!.contains(relatedTarget));

			if (input_or_children_focused) {
				// Reset focus to input element
				focus();
			}
			else if (focused) {
				focused = false;
				on_focus_out?.();
			}
		}}
	>
{/snippet}

{#snippet clear_button()}
	{#if value}
		<Button
			class="field-clear"
			focusable={false}
			type="plain"
			onclick={() => {
				value = '';
				on_clear?.();
			}}
			>
			{#snippet icon()}
				<ClearIcon />
			{/snippet}
		</Button>
	{/if}
{/snippet}

{#snippet field_icon()}
	{#if icon}
		<span class="field-icon">
			{@render icon()}
		</span>
	{/if}
{/snippet}

{#snippet field_loading()}
	<Loading bars class="field-loading" visible={input_loading} />
{/snippet}
