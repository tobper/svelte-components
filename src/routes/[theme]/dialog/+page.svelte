<script lang="ts">
	import { Button, Card, CardContent, device, Dialog, DialogContent, PageContent, TextField } from '$lib/index.js';
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
		<TextField />
	</DialogContent>

	{#snippet footer()}
		<form method="dialog">
			<Button autofocus={device.touch} submit type="outlined" text="Close" />
		</form>
	{/snippet}
</Dialog>
