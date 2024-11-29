<script lang="ts" module>
	// Needed to avoid lint error "'Value' is not defined"
	type Value = object;
</script>

<script lang="ts" generics="Value">
	import ButtonBorder from '../ButtonBorder.svelte';
	import { get_radio_group_context } from './RadioGroup.svelte';

	interface RadioButton {
		text: string;
		value: Value;
		small?: boolean;
	}

	const radio_group = get_radio_group_context<Value>()

	let { text, value, small }: RadioButton = $props();
	let { disabled, name, required, selected_value, deselect, select } = $derived(radio_group);
	let checked = $derived(value === selected_value);
</script>

<label
	aria-current={checked ? true : undefined}
	class="button-outlined"
	class:button--small={small}
	class:radio-button--optional={!required}
>
	<div class="input-container">
		<input
			{disabled}
			{name}
			{value}
			type="radio"
			onclick={() => {
				if (value !== selected_value)
					select(value);
				else if (!required)
					deselect();
			}}
			onkeydown={event => event.stopPropagation()}
			bind:group={radio_group.selected_value}
	  	/>
	</div>

	<span>{text}</span>

	<ButtonBorder type="outlined" />
</label>

<style>
	.input-container {
		position: absolute;
		width: 0;
		height: 0;
		overflow: clip;
	}
</style>
