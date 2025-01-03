<script lang="ts">
	import { get_element } from '$lib/html';
	import { unique_id } from '$lib/unique_id';
	import type { Snippet } from 'svelte';
	import ButtonBorder from './ButtonBorder.svelte';
	
	interface PopoverButton {
		id?: string;
		animation?: 'fade' | 'flip' | 'rotate';
		class?: string;
		content?: Snippet<['open' | 'closed']>;
		disabled?: boolean;
		element?: HTMLElement;
		popover: string;
		text?: string;
		type?: 'plain' | 'outlined';
	}

	let {
		id = $bindable(unique_id()),
		animation = 'fade',
		class: label_class,
		content,
		disabled = false,
		element = $bindable(),
		popover,
		text,
		type = 'outlined',
	}: PopoverButton = $props();
	let popover_open = $state(false);

	$effect(() => {
		const popover_element = get_element(popover);

		popover_element.addEventListener('toggle', on_toggle);

		return function cleanup() {
			popover_element.removeEventListener('toggle', on_toggle);
		}

		function on_toggle() {
			popover_open = popover_element.matches(':popover-open');
		}
	})
</script>

<button
	bind:this={element}
	{id}
	aria-disabled={disabled ? true : undefined}
	aria-pressed={popover_open ? true : undefined}
	class={label_class}
	class:button-outlined={type === 'outlined'}
	class:button-plain={type === 'plain'}
	class:button--round={!text}
	popovertarget={popover}
	onclick={event => {
		if (disabled) {
			event.preventDefault()
			event.stopImmediatePropagation()
		}
	}}
>
	{#if content}
		<div
			class="swap"
			class:swap--active={popover_open}
			class:swap--flip={animation === 'flip'}
			class:swap--rotate={animation === 'rotate'}
		>
			<span class="swap--on">
				{@render content('open')}
			</span>
			<span class="swap--off">
				{@render content('closed')}
			</span>
		</div>
	{/if}
 
	{#if text}
	  	<span>{text}</span>
	{/if}

	<ButtonBorder {type} />
</button>
