<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import ButtonBorder from '../ButtonBorder.svelte';

	interface CheckButton {
		animation?: 'fade' | 'flip' | 'rotate';
		class?: ClassValue;
		checked?: boolean;
		content?: Snippet<[boolean]>;
		disabled?: boolean;
		element?: HTMLElement;
		name?: string;
		rounded?: boolean;
		text?: string;
		type?: 'plain' | 'outlined';
		value?: unknown;
		onchange?: (checked: boolean) => void;
		onclick?: HTMLInputElement['onclick'];
	}

	let {
		animation = 'fade',
		class: label_class,
		checked = $bindable(false),
		content,
		disabled = false,
		element = $bindable(),
		name,
		rounded,
		onchange,
		onclick,
		text,
		type = 'outlined',
		value,
	}: CheckButton = $props();
</script>

<label
	bind:this={element}
	aria-checked={checked ? true : undefined}
	class={label_class}
	class:button-outlined={type === 'outlined'}
	class:button-plain={type === 'plain'}
	class:button--round={rounded ?? !text}
>
	<div class="input-container">
		<input
			bind:checked
			{disabled}
			{name}
			{onclick}
			{value}
			type="checkbox"
			onchange={event => {
				if (disabled) {
					event.preventDefault()
					event.stopImmediatePropagation()
				}
				else
					onchange?.(checked);
			}}
		/>
	</div>

	{#if content}
		<div
			class="swap"
			class:swap--active={checked}
			class:swap--flip={animation === 'flip'}
			class:swap--rotate={animation === 'rotate'}
		>
			<span class="swap--on">
				{@render content(true)}
			</span>
			<span class="swap--off">
				{@render content(false)}
			</span>
		</div>
	{/if}

	{#if text}
	  	<span>{text}</span>
	{/if}

	<ButtonBorder {type} />
</label>

<style>
	.input-container {
		position: absolute;
		width: 0;
		height: 0;
		overflow: clip;
	}
</style>
