<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, Card, CardContent, CommandPalette, Kbd, PageContent } from '$lib/index.js';
	import { IconAppWindow, IconLink } from '@tabler/icons-svelte';
	import { nav_items } from '../data';

	let visible = $state(false)

	const route_options = nav_items.map(([, name, path]) => ({
	 	type: 'route',
		label: name,
		action: {
			caption: `Goto "${name}" page`,
			run: () => goto(resolve(`/neomorphism${path}`))}
		}))
</script>

<svelte:window onkeydown={event => {
	if (event.key === 'Escape' && !visible) {
		visible = true
		event.preventDefault()
	}
}} />

<PageContent header="Command palette">
	<Card>
		<CardContent>
			<Button type="outlined" text="Open" onclick={() => visible = true}>
				{#snippet icon()}
					<IconAppWindow />
				{/snippet}
			</Button>
			<div class="flow-items gap-tiny">
				Or press
				<Kbd key="esc" />
			</div>
		</CardContent>
	</Card>
</PageContent>

<CommandPalette
	bind:visible
	options={[
		...route_options
	]}
>
	{#snippet icon(type)}
		{#if type === 'route'}
			<IconLink />
		{/if}
	{/snippet}
</CommandPalette>
