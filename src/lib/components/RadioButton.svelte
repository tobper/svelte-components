<script lang="ts">
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
	class="button button-outlined"
	class:button--small={small}
	class:button--pressed={checked}
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
</label>

<style>
	.input-container {
		position: absolute;
		width: 0;
		height: 0;
		overflow: clip;
	}
</style>
