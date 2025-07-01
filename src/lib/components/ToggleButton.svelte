<script lang="ts" generics="Option">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	
	interface ToggleButton {
		animation?: 'fade' | 'flip' | 'rotate';
		class?: ClassValue;
		content: Snippet<[Option]>;
		disabled?: boolean;
		name?: string;
		options: Option[];
		text?: string;
		title?: string;
		type?: 'outlined' | 'plain';
		value: Option;
		onchange?: (value: Option) => void;
		onclick?: HTMLInputElement['onclick'];
	}

	let {
		animation = 'fade',
		class: label_class,
		content,
		disabled = false,
		name,
		onchange,
		onclick,
		options,
		text,
		title,
		type = 'plain',
		value = $bindable(),
	}: ToggleButton = $props();
</script>

<button
	{title}
	class={label_class}
	class:button-outlined={type === 'outlined'}
	class:button-plain={type === 'plain'}
	class:button--round={!text}
	type="button"
	onclick={event => {
		if (disabled) {
			event.preventDefault()
			event.stopImmediatePropagation()
		}
		else {
			const current_index = options.indexOf(value);
			const next_index = (current_index + 1) % options.length;

			value = options[next_index];
			onchange?.(value);
		}
	}}
>
	<div
		class="swap"
		class:swap--flip={animation === 'flip'}
		class:swap--rotate={animation === 'rotate'}
		role="listbox"
	>
		<input
			{disabled}
			{name}
			{onclick}
			{value}
			type="hidden"
		/>

		{#each options as option, index (index)}
			<span class="swap--option" aria-selected={value === option} role="option">
				{@render content(option)}
			</span>
		{/each}
	</div>
 
	{#if text}
	  	<span>{text}</span>
	{/if}
</button>
