<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { unique_id } from '../../unique_id.js';
	import Button from '../Button.svelte';
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
		disabled?: boolean;
		error_hint?: boolean;
		focused?: boolean;
		id?: string;
		input_class?: string;
		inputmode?: HTMLInputAttributes['inputmode'];
		label?: string;
		list?: HTMLInputAttributes['list'];
		loading?: boolean;
		name?: string;
		placeholder?: HTMLInputAttributes['placeholder'];
		role?: HTMLInputAttributes['role'];
		// readonly?: boolean;
		required?: boolean;
		type?: HTMLInputAttributes['type'];
		value?: unknown;

		onclick?: HTMLInputAttributes['onclick'];
		onkeydown?: HTMLInputAttributes['onkeydown'];
		onpaste?: HTMLInputAttributes['onpaste'];
		on_focus_in?: () => void;
		on_focus_out?: () => void;
		on_input?: () => void;

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
		disabled = false,
		error_hint = false,
		focused = false,
		input_class,
		inputmode,
		label,
		list,
		loading: input_loading = false,
		name,
		placeholder,
		role,
		// readonly = false,
		required = false,
		type = 'text',
		value = '',

		onclick,
		onkeydown,
		onpaste,
		on_focus_in,
		on_focus_out,
		on_input,

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

	let content_element = $state<Element | undefined>();
	let input_element = $state<HTMLInputElement>();
	let label_id = unique_id();

	function handle_input() {
		value = input_element?.value === '' && !required
				? null
				: input_element?.value;

		on_input?.();
	}
</script>

<Field
	bind:element={field_element}
	{error_hint}
	{label}
	{name}
	{required}
	class={field_class}	
>
	{#snippet content({ id, error_text, loading, readonly })}
		<div class="field-input">
			{#if prefix}
				{@render prefix()}
			{/if}

			<div class="field-input-text" class:skeleton={loading}>
				<input
					{autocomplete}
					{disabled}
					{id}
					{inputmode}
					{list}
					{name}
					{placeholder}
					{readonly}
					{required}
					{role}
					{type}
					bind:this={input_element}
					aria-activedescendant={aria_activedescendant}
					aria-autocomplete={aria_autocomplete}
					aria-controls={aria_controls}
					aria-expanded={aria_expanded ? true : undefined}
					aria-haspopup={aria_haspopup ? true : undefined}
					aria-invalid={error_text ? true : undefined}
					aria-labelledby={label_id}
					class={input_class}
					value={value ?? ''}
					{onclick}
					{onkeydown}
					{onpaste}
					onfocusin={() => {
						if (focused)
							return;

						focused = true
						on_focus_in?.();
					}}
					onfocusout={event => {
						const { relatedTarget } = event;
						const content_focused =
							relatedTarget instanceof Element &&
							content_element?.contains(relatedTarget);

						if (content_focused) {
							focus();
						}
						else if (focused) {
							focused = false;
							on_focus_out?.();
						}
					}}
					oninput={handle_input}
				>

				{#if value}
					<Button
						class="field-clear"
						focusable={false}
						type="plain"
						onclick={() => {
							input_element!.value = '';
							handle_input();
							// TODO: Fix triggering of events in a better way
							on_focus_out?.();
						}}
					>
						{#snippet icon()}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
								<path d="M18 6l-12 12" />
								<path d="M6 6l12 12" />
							</svg>
						{/snippet}
					</Button>
				{/if}
			
				{#if icon}
					<span class="field-icon">
						{@render icon()}
					</span>
				{/if}

				<Loading bars class="field-loading" visible={input_loading} />
			</div>

			{#if suffix}
				{@render suffix()}
			{/if}
		</div>

		{#if children}
			<div bind:this={content_element}>
				{@render children()}
			</div>
		{/if}
	{/snippet}
</Field>
	