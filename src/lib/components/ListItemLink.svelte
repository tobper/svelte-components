<script lang="ts">
	import { getTransition, type TransitionValue } from '$lib/animations';
	import type { ClassValue } from 'svelte/elements';
	import ListItemContent, { type ListItemContentProps } from './ListItemContent.svelte';

	interface ListItemLinkProps extends ListItemContentProps {
		class?: ClassValue;
		current?: boolean;
		indent?: number;
		href: string;
		transition?: TransitionValue;
	}

	let {
		class: class_name,
		current = false,
		indent,
		href,
		transition: transition_input,

		// LisItemContent
		icon,
		label,
		kbd,
		details,
	}: ListItemLinkProps = $props();
	let transition = $derived(getTransition(transition_input));
</script>

<li transition:transition>
	<a
		aria-current={current ? 'page' : undefined}
		class={['list-item-link link', class_name]}
		style:--list-item__indent={indent}
		{href}
	>
		<ListItemContent {icon} {label} {kbd} {details} />
	</a>
</li>
