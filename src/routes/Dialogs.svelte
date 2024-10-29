<script lang="ts">
	import { Button, Card, Dialog, PageContent, PageHeader } from '$lib/index.js';

	let visible = $state(false);
</script>

<PageContent id="Dialog">
	<PageHeader text="Dialog" />
	<Card>
		<div class="flow-items">
			<Button type="outlined" text="Open" onclick={() => { visible = true; }} />
		</div>
	</Card>
</PageContent>

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
