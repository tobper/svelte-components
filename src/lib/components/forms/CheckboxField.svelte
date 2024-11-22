<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Checkbox from './Checkbox.svelte';
	import Field from './Field.svelte';

	type CheckboxProps = ComponentProps<typeof Checkbox>;
	type FieldProps = ComponentProps<typeof Field>;

	interface CheckboxField {
		field_element?: HTMLElement | undefined;

		class?: FieldProps['class'];
		error_hint?: FieldProps['error_hint'];
		id?: FieldProps['id'];
		label?: FieldProps['label'];
		name?: FieldProps['name'];

		checked?: CheckboxProps['checked'];
		disabled?: CheckboxProps['disabled'];
		indeterminate?: CheckboxProps['indeterminate'];
		readonly?: CheckboxProps['readonly'];
	}

	let {
		checked = $bindable(false),
		class: field_class,
		error_hint,
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
