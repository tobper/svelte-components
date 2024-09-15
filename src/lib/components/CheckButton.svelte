<script lang="ts">
	import type { Snippet } from 'svelte';
	import { classes } from '../classes.js';

	interface CheckButton {
		class?: string;
		checked?: boolean;
		disabled?: boolean;
		name?: string;
		state_checked?: Snippet;
		state_unchecked?: Snippet;
		text?: string;
		transition?: 'fade' | 'flip' | 'rotate';
		value?: unknown;
		onchange?: () => void;
		onclick?: HTMLInputElement['onclick'];
	}

	let {
		class: label_class,
		checked = false,
		disabled = false,
		name,
		onchange,
		onclick,
		state_checked,
		state_unchecked,
		text,
		transition = 'fade',
		value,
	}: CheckButton = $props();
</script>

<label
	class={classes('button-outlined', label_class)}
	class:button-round={!text}
	class:button--pressed={checked}
>
	<div class="input-container">
		<input
			{disabled}
			{name}
			{onclick}
			{value}
			type="checkbox"
			bind:checked
			onchange={event => {
				if (disabled) {
					event.preventDefault()
					event.stopImmediatePropagation()
				}

				onchange?.();
			}}
		/>
	</div>

	{#if state_checked && state_unchecked}
		<div
			class="swap"
			class:swap--active={checked}
			class:swap--flip={transition === 'flip'}
			class:swap--rotate={transition === 'rotate'}
		>
			<span class="swap--on">
				{@render state_checked()}
			</span>
			<span class="swap--off">
				{@render state_unchecked()}
			</span>
		</div>
	{/if}
 
	{#if text}
	  	<span>{text}</span>
	{/if}
</label>

<style>
	.input-container {
		position: absolute;
		width: 0;
		height: 0;
		overflow: clip;
	}
</style>
