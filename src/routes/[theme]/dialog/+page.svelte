<script lang="ts">
	import { Button, Card, CardContent, Dialog, DialogContent, PageContent } from '$lib/index.js';
	import { lorem } from '../data.js';

	let visible = $state(false);
</script>

<PageContent header="Dialog">
	<Card>
		<CardContent>
			<Button type="outlined" text="Open" onclick={() => { visible = true; }} />
		</CardContent>
	</Card>
</PageContent>

<Dialog bind:visible header="Header" width="600px">
	<DialogContent>
		<p>{lorem}</p>
	</DialogContent>

	{#snippet footer()}
		<form method="dialog">
			<Button submit type="outlined" text="Close" />
		</form>
	{/snippet}
</Dialog>
