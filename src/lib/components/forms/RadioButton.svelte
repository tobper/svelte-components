<script lang="ts">
	import ButtonBorder from '../ButtonBorder.svelte';
	import { get_radio_group_context } from './RadioGroup.svelte';

	interface RadioButton {
		text: string;
		value?: unknown;
		small?: boolean;
		onchange?: (value: unknown) => void;
	}

	const radio_group = get_radio_group_context()

	let { text, value, small, onchange }: RadioButton = $props();
	let { disabled, name, selected_value, select } = $derived(radio_group);
	let checked = $derived(value === selected_value);
</script>

<label
	aria-current={checked ? true : undefined}
	class="button-outlined"
	class:button--small={small}
>
	<div class="input-container">
		<input
			{disabled}
			{name}
			{value}
			type="radio"
			onclick={() => {
				select(value);
				onchange?.(value);
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
