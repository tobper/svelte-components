<script lang="ts">
	import { type ComponentProps, type Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { classes } from '../../classes.js';
	import { unique_id } from '../../unique_id.js';
	import Button from '../Button.svelte';
	import ClearIcon from '../icons/ClearIcon.svelte';
	import Loading from '../Loading.svelte';
	import Field from './Field.svelte';

	type FieldProps = ComponentProps<typeof Field>;

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
		focused?: boolean;
		input_class?: string;
		input_element?: HTMLInputElement;
		inputmode?: HTMLInputAttributes['inputmode'];
		list?: HTMLInputAttributes['list'];
		loading?: boolean;
		name?: string;
		pattern?: HTMLInputAttributes['pattern'];
		placeholder?: HTMLInputAttributes['placeholder'];
		role?: HTMLInputAttributes['role'];
		readonly?: boolean;
		required?: boolean;
		title?: HTMLInputAttributes['title'];
		type?: HTMLInputAttributes['type'];
		value?: string | null;

		error_hint?: FieldProps['error_hint'];
		errors?: FieldProps['errors'];
		id?: FieldProps['id'];
		label?: FieldProps['label'];

		onclick?: HTMLInputAttributes['onclick'];
		onkeydown?: HTMLInputAttributes['onkeydown'];
		oninput?: HTMLInputAttributes['oninput'];
		onpaste?: HTMLInputAttributes['onpaste'];
		onselectionchange?: HTMLInputAttributes['onselectionchange'];
		on_clear?: () => void;
		on_focus_in?: () => void;
		on_focus_out?: () => void;

		children?: Snippet;
		prefix?: Snippet;
		prefix_icon?: Snippet;
		suffix?: Snippet;
		suffix_icon?: Snippet;
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
		error_hint,
		errors,
		focused = $bindable(false),
		id = $bindable(unique_id()),
		input_class,
		input_element = $bindable(),
		inputmode,
		label,
		list,
		loading: input_loading = false,
		name,
		pattern,
		placeholder,
		role,
		readonly = false,
		required = false,
		title,
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
		prefix,
		prefix_icon,
		suffix,
		suffix_icon,
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
	{errors}
	{id}
	{label}
	{name}
	{required}
	class={field_class}	
>
	{#snippet content({ content_id, error_text, loading, in_progress })}
		<div bind:this={field_input_element} class="field-content" class:skeleton={loading}>
			{#if prefix}
				{@render prefix()}
			{/if}

			<label class="field-input">
				{@render field_prefix_icon()}
				{@render input(content_id, error_text, in_progress)}
				{@render field_clear()}
				{@render field_suffix_icon()}
				{@render field_loading()}
			</label>

			{#if suffix}
				{@render suffix()}
			{/if}
		</div>

		{#if children && !in_progress && !disabled}
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
		{pattern}
		{placeholder}
		{required}
		{role}
		{title}
		{type}
		bind:this={input_element}
		bind:value
		aria-activedescendant={aria_activedescendant}
		aria-autocomplete={aria_autocomplete}
		aria-controls={aria_controls}
		aria-expanded={aria_expanded}
		aria-haspopup={aria_haspopup ? true : undefined}
		aria-invalid={error_text ? true : undefined}
		aria-labelledby={label_id}
		class={classes('field-value', input_class)}
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
				children_element?.contains(relatedTarget);

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

{#snippet field_clear()}
	{#if value}
		<Button
			class="field-clear"
			focusable={false}
			rounded={false}
			onclick={() => {
				// Make sure both bound value and input value is updated before calling callback
				value = input_element!.value = '';
				on_clear?.();
			}}
		>
			{#snippet icon()}
				<ClearIcon />
			{/snippet}
		</Button>
	{/if}
{/snippet}

{#snippet field_prefix_icon()}
	{#if prefix_icon}
		<div class="field-icon">
			{@render prefix_icon()}
		</div>
	{/if}
{/snippet}

{#snippet field_suffix_icon()}
	{#if suffix_icon}
		<div class="field-icon">
			{@render suffix_icon()}
		</div>
	{/if}
{/snippet}

{#snippet field_loading()}
	{#if input_loading}
		<div class="field-loading">
			<Loading bars />
		</div>
	{/if}
{/snippet}
