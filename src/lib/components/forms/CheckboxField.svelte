<script lang="ts">
	import Checkbox from './Checkbox.svelte';
	import Field from './Field.svelte';

	interface CheckboxField {
		checked?: boolean;
		class?: string;
		field_element?: HTMLElement | undefined;
		disabled?: boolean;
		error_hint?: boolean;
		id?: string;
		indeterminate?: boolean;
		label?: string;
		name?: string;
		readonly?: boolean;
	}

	let {
		checked = $bindable(false),
		class: field_class,
		error_hint = false,
		field_element = $bindable(),
		id,
		indeterminate = $bindable(false),
		label,
		name,
		readonly,
		...checkbox_props
	}: CheckboxField = $props();
</script>

<Field
	bind:element={field_element}
	{error_hint}
	{id}
	{label}
	{name}
	class={field_class}
	required={true}
>
	{#snippet content({ content_id, error_text, in_progress })}
		<Checkbox
			{...checkbox_props}
			{name}
			id={content_id}
			invalid={!!error_text}
			readonly={in_progress || readonly}
			bind:checked
			bind:indeterminate
		/>
  	{/snippet}
</Field>
