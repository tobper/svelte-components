<script lang="ts">
	interface DialogHeader {
		text: string;
	}

	let { text }: DialogHeader = $props();
</script>

<header class="dialog-header">
	<h2>{text}</h2>
	<hr>
</header>
