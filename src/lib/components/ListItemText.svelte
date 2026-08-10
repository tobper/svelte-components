<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface ListItemText {
		children?: Snippet;
		class?: ClassValue;
		indent?: number;
		text?: string;
	}

	let {
		children,
		class: class_name,
		indent,
		text,
		...attachments
	}: ListItemText = $props();
</script>

<li
	class={['list-item-text', class_name]}
	role="presentation"
	style:--list-item__indent={indent}
	{...attachments}
>
	{text}
	{@render children?.()}
</li>
