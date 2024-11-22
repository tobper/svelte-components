<script lang="ts" module>
	import { getContext, setContext, type Snippet } from 'svelte';

	interface RadioGroupContext {
		disabled: boolean;
		name: string;
		select: (value: unknown) => void;
		selected_value: unknown;
	}

	const context_key = Symbol('RadioGroup');

	function set_context(state: RadioGroupContext) {
		return setContext(context_key, state);
	}
 
	export function get_radio_group_context() {
		return getContext<RadioGroupContext>(context_key);
	}
 </script>
 
 <script lang="ts">
	import { classes } from '../../classes.js';
	import { match } from '../../match.js';
	import { scale_fast, slide_fast } from '../../transitions/index.js';
	import { unique_id } from '../../unique_id.js';

	interface RadioGroup {
		animation?: 'slide' | 'scale' | 'none';
		class?: string;
		disabled?: boolean;
		name?: string;
		selected_value?: unknown;
		children: Snippet;
	}

	let {
		animation = 'none',
		class: group_class,
		disabled = false,
		name = unique_id(),
		selected_value = $bindable(null),
		children,
	}: RadioGroup = $props();

	let transition = $derived(
		match(animation, {
			scale: scale_fast,
			slide: slide_fast,
			none: () => ({ duration: 0 }),
		})
	);

	const context = $state<RadioGroupContext>({
		disabled: false,
		name: unique_id(),
		select: value => selected_value = value,
		selected_value: null,
	});

	set_context(context);

	$effect.pre(() => {
		context.disabled = disabled;
		context.name = name;
		context.selected_value = selected_value;
	});
</script>

<div
	class={classes('button-group', group_class)}
	role="radiogroup"
	transition:transition
>
	{@render children()}
</div>
