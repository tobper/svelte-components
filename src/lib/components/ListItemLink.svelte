<script lang="ts">
	import ListItemContent, { type ListItemContentProps } from './ListItemContent.svelte';

	interface ListItemLinkProps extends ListItemContentProps {
		current?: boolean;
		href: string;
	}

	let {
		current = false,
		href,

		// LisItemContent
		children,
		icon,
		kbd,
		text,
	}: ListItemLinkProps = $props();
</script>

<li>
	<a
		aria-current={current ? 'page' : undefined}
		class="link list-item-link"
		{href}
	>
		<ListItemContent {children} {icon} {kbd} {text} /> 
	</a>
</li>
