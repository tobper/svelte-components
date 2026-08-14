<script lang="ts">
	import { onNavigate } from '$app/navigation'
	import { get_root_style } from '$lib/css'
	import { try_parse_milliseconds } from '$lib/time'
	import { untrack, type Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'

	interface Dialog {
		children: Snippet
		class?: ClassValue
		visible?: boolean
		propagate_key_events?: boolean
		on_open?: () => void
		on_close?: () => void
		on_closed?: () => void
	}

	let {
		children,
		class: drawer_class,
		visible = $bindable(false),
		propagate_key_events = false,
		on_open,
		on_close,
		on_closed,
	}: Dialog = $props()
	let on_closed_timer: ReturnType<typeof setTimeout> | null = null
	let drawer = $state.raw<HTMLDialogElement>()

	$effect(() => {
		if (visible) {
			if (on_closed_timer)
				clearTimeout(on_closed_timer)

			if (on_open)
				untrack(on_open)

			drawer?.showModal()
		}
		else {
			drawer?.close()
		}
	})

	// Close drawer on navigation
	onNavigate(() => {
		visible = false
	})

	function stop_propagation(event: Event) {
		event.stopPropagation()
	}
</script>

<dialog
	bind:this={drawer}
	class={['drawer', drawer_class]}
	onclick={e => {
		if (e.target === e.currentTarget)
			e.currentTarget.close()
	}}
	onclose={() => {
		on_close?.()
		visible = false

		if (on_closed) {
			const animation_duration =
				(try_parse_milliseconds(get_root_style('--layout__zoom-delay')) ?? 0 ) +
				(try_parse_milliseconds(get_root_style('--layout__zoom-duration')) ?? 0)

			on_closed_timer = setTimeout(on_closed, animation_duration)
		}
	}}
	onkeydown={propagate_key_events ? undefined : stop_propagation}
	onkeyup={propagate_key_events ? undefined : stop_propagation}
	onkeypress={propagate_key_events ? undefined : stop_propagation}
>
	<div class="drawer-content">
		{@render children()}
	</div>
</dialog>
