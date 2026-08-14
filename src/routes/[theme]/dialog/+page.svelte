<script lang="ts">
	import { Button, Card, CardContent, device, Dialog, DialogContent, Drawer, PageContent, TextField } from '$lib/index.js'
	import { IconHome } from '@tabler/icons-svelte-runes'
	import { lorem } from '../data.js'

	let dialog_visible = $state(false)
	let drawer_visible = $state(false)
	let key_pressed = $state<string>()
</script>

<svelte:window
	onkeydown={e => {
		key_pressed = e.key
	}}
/>

<PageContent header="Dialog">
	<Card>
		<CardContent>
			<Button type="outlined" text="Open" onclick={() => { dialog_visible = true }} />
		</CardContent>
		<CardContent>
			<output>
				Key pressed: {key_pressed}
			</output>
		</CardContent>
	</Card>
</PageContent>

<PageContent header="Drawer">
	<Card>
		<CardContent>
			<Button type="outlined" text="Open" onclick={() => { drawer_visible = true }} />
		</CardContent>
	</Card>
</PageContent>

<Dialog bind:visible={dialog_visible} header="Header" width="600px">
	<DialogContent>
		<p>{lorem}</p>
		<TextField autofocus />
	</DialogContent>

	{#snippet footer()}
		<form method="dialog">
			<Button autofocus={device.touch} submit type="outlined" text="Close" />
		</form>
	{/snippet}
</Dialog>

<Drawer bind:visible={drawer_visible}>
	<h4><IconHome /> Header</h4>
	<p>{lorem}</p>
</Drawer>
