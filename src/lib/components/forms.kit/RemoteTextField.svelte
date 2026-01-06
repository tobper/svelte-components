<script lang="ts">
	import { type ComponentProps, type Snippet } from 'svelte';
	import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
	import Field from '../forms/Field.svelte';
	import { unique_id } from '$lib/unique_id';
	import { on } from '$lib/html';
	import Button from '../Button.svelte';
	import ClearIcon from '../icons/ClearIcon.svelte';
	import Loading from '../Loading.svelte';
	import type { RemoteFormField } from '@sveltejs/kit';

	type FieldProps = ComponentProps<typeof Field>

	interface TextFieldKit {
		input?: HTMLInputAttributes;
		class?: ClassValue;
		can_clear?: boolean;
		content_element?: HTMLElement | undefined;
		field_element?: HTMLElement | undefined;
		disabled?: boolean;
		focused?: boolean;
		input_element?: HTMLInputElement;
		loading?: boolean;
		readonly?: boolean;
		required?: boolean;

		field: RemoteFormField<string>

		error_hint?: FieldProps['error_hint'];
		id?: FieldProps['id'];
		label?: FieldProps['label'];

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
		input,
		can_clear = true,
		class: field_class,
		content_element = $bindable(),
		field_element = $bindable(),
		disabled = false,
		error_hint,
		focused = $bindable(false),
		id = $bindable(unique_id()),
		input_element = $bindable(),
		label,
		loading: input_loading = false,
		readonly = false,
		required = false,

		field,

		on_clear,
		on_focus_in,
		on_focus_out,

		children,
		prefix,
		prefix_icon,
		suffix,
		suffix_icon,
	}: TextFieldKit = $props()

	const focus_handler = (input: HTMLElement) => on(input, {
		focusin() {
			if (focused)
				return

			focused = true
			on_focus_in?.()
		},
		focusout(event) {
			const { relatedTarget } = event
			const child_focused =
				relatedTarget instanceof Element &&
				(
					relatedTarget === clear_element ||
					children_element?.contains(relatedTarget)
				)

			if (child_focused) {
				// Reset focus to input element
				input.focus()
			}
			else if (focused) {
				focused = false
				on_focus_out?.()
			}
		}
	})

	export function blur() {
		input_element?.blur()
	}

	export function focus() {
		input_element?.focus()
	}

	let children_element = $state<HTMLElement>();
	let clear_element = $state<HTMLElement>();
</script>

<Field
	bind:element={field_element}
	{error_hint}
	{id}
	{label}
	{required}
	class={field_class}
	errors={field.issues()?.map(issue => issue.message)}
	name={input?.name}
>
	{#snippet content({ content_id, error_text, loading, in_progress })}
		<div
			bind:this={content_element}
			class="field-content"
			class:skeleton={loading}
		>
			{#if prefix}
				{@render prefix()}
			{/if}

			<div class="field-input">
				{@render field_prefix_icon()}
				{@render field_input(content_id, error_text, in_progress)}
				{@render field_clear(in_progress)}
				{@render field_suffix_icon()}
				{@render field_loading()}
			</div>

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

{#snippet field_input(content_id: string, error_text: string | null, in_progress: boolean)}
	{@const props: HTMLInputAttributes = {
		...input,
		'aria-invalid': error_text ? true : input?.['aria-invalid'],
		class: ['field-value', input?.class],
		disabled: disabled || input?.disabled,
		id: content_id,
		readonly: input?.readonly || in_progress
	}}

  	<input
   	{@attach focus_handler}
      bind:this={input_element}
     	{...props}
      {...field.as('text')}
   />
{/snippet}

{#snippet field_clear(in_progress: boolean)}
	{#if can_clear}
		<Button
			bind:element={clear_element}
			class={[
				'field-clear',
				{
					'field-clear--enabled': !!field.value() && !disabled && !input_loading && !readonly && !in_progress
				}
			]}
			focusable={false}
			rounded={false}
			onclick={() => {
				field.set('')

				// // Make sure both bound value and input value is updated before calling callback
				// if (input_element)
				// 	input_element.value = value;

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
		<div class="field-prefix-icon">
			{@render prefix_icon()}
		</div>
	{/if}
{/snippet}

{#snippet field_suffix_icon()}
	{#if suffix_icon}
		<div class="field-suffix-icon" class:visible={!input_loading}>
			{@render suffix_icon()}
		</div>
	{/if}
{/snippet}

{#snippet field_loading()}
	<div class="field-loading" class:visible={input_loading}>
		<Loading bars />
	</div>
{/snippet}
