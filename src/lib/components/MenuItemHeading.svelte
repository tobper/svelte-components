<script lang="ts">
	interface MenuItemHeading {
		text?: string;
	}

	let {
		text,
	}: MenuItemHeading = $props();
</script>

<div class="menu-item-heading" role="heading" aria-level={4}>
	{text}
</div>
