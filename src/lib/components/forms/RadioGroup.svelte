<script lang="ts" module>
	import { getContext, setContext, type Snippet } from 'svelte';

	// Needed to avoid lint error "'Value' is not defined"
	type Value = object;

	interface RadioGroupContext<Value> {
		disabled: boolean;
		name: string;
		required: boolean;
		deselect: () => void;
		select: (value: Value) => void;
		selected_value: Value | null;
	}

	const context_key = Symbol('RadioGroup');

	function set_context<Value>(state: RadioGroupContext<Value>) {
		return setContext(context_key, state);
	}

	export function get_radio_group_context<Value>() {
		return getContext<RadioGroupContext<Value>>(context_key);
	}
 </script>

 <script lang="ts" generics="Value">
	import type { ClassValue } from 'svelte/elements';
	import { match } from '../../match.js';
	import { scale_fast, slide_fast } from '../../transitions/index.js';
	import { unique_id } from '../../unique_id.js';
	import RadioButton from './RadioButton.svelte';

	interface RadioGroup {
		animation?: 'slide' | 'scale' | 'none';
		buttons?: Array<{ text: string; value: Value }>;
		class?: ClassValue;
		disabled?: boolean;
		name?: string;
		required?: boolean;
		selected_value?: Value | null;
		children?: Snippet;
		on_deselect?: () => void;
		on_select?: (value: Value) => void;
	}

	let {
		animation = 'none',
		buttons,
		class: group_class,
		disabled = false,
		name = unique_id(),
		required = false,
		selected_value = $bindable(null),
		children,
		on_deselect,
		on_select,
	}: RadioGroup = $props();

	let transition = $derived(
		match(animation, {
			scale: scale_fast,
			slide: slide_fast,
			none: () => ({ duration: 0 }),
		})
	);

	const context = $state<RadioGroupContext<Value>>({
		disabled: false,
		name: unique_id(),
		required: false,
		deselect: () => {
			if (required)
				throw new Error('Required radio group must have a value');

			selected_value = null;
			on_deselect?.();
		},
		select: value => {
			selected_value = value
			on_select?.(value);
		},
		selected_value: null,
	});

	set_context(context);

	$effect.pre(() => {
		context.disabled = disabled;
		context.name = name;
		context.required = required;
		context.selected_value = selected_value;
	});
</script>

<div
	class={['button-group', group_class]}
	role="radiogroup"
	transition:transition
>
	{#if buttons}
		{#each buttons as { text, value } (value)}
			<RadioButton {text} {value} />
		{/each}
	{/if}

	{@render children?.()}
</div>
