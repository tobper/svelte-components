<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	interface ListItemSeparator {
		class?: ClassValue;
		indent?: number;
	}

	let {
		class: class_name,
		indent,
		...attachments
	}: ListItemSeparator = $props();
</script>

<li
	class={['list-item-separator', class_name]}
	role="separator"
	style:--list-item__indent={indent}
	{...attachments}
>
	<hr />
</li>
