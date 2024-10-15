<script lang="ts">
	import { Button, Card, Dialog, PageHeader } from '$lib/index.js';

	let visible = $state(false);
</script>

<article class="page-content" id="Dialog">
	<PageHeader text="Dialog" />
	<Card>
		<div class="flow-items">
			<Button type="outlined" text="Open" onclick={() => { visible = true; }} />
		</div>
	</Card>
</article>

<Dialog bind:visible header="Header">
	<div style="width: 400px;">
		Hello
	</div>

	{#snippet footer()}
		<form method="dialog">
			<Button submit type="outlined" text="Close" />
		</form>
	{/snippet}
</Dialog>
