<script lang="ts">
	import { getTransition, type TransitionValue } from '$lib/animations';
	import ListItemContent, { type ListItemContentProps } from './ListItemContent.svelte';

	interface ListItemLinkProps extends ListItemContentProps {
		current?: boolean;
		href: string;
		transition?: TransitionValue;
	}

	let {
		current = false,
		href,
		transition: transition_input,

		// LisItemContent
		children,
		icon,
		kbd,
		text,
	}: ListItemLinkProps = $props();
	let transition = $derived(getTransition(transition_input));
</script>

<li transition:transition>
	<a
		aria-current={current ? 'page' : undefined}
		class="link list-item-link"
		{href}
	>
		<ListItemContent {children} {icon} {kbd} {text} />
	</a>
</li>
