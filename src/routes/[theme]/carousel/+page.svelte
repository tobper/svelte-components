<script lang="ts">
	import { Button, Card, CardContent, Carousel, CheckboxField, device, Dialog, mappedTextNumber, PageContent, Stack, TextField, variants } from '$lib/index.js';
	import { fruits } from '../data.js';

	let dialog_visible = $state(false);
	let markers = $state(true);
	let page_count = mappedTextNumber(5);
	let visible_page = mappedTextNumber(2);

	const pages = $derived(
		fruits.slice(0, Math.min(9, page_count.current))
	)

</script>

<PageContent header="Dialog">
	<Card>
		<CardContent>
			<Stack horizontal>
				<TextField
					bind:value={page_count.mapped}
					can_clear={false}
					label="Pages"
					min={1}
					max={9}
					required
					type="number"
				/>

				<TextField
					bind:value={visible_page.mapped}
					can_clear={false}
					label="Visible page"
					min={1}
					max={page_count.current}
					required
					type="number"
				/>

				<CheckboxField
					bind:checked={markers}
					label="Markers"
				/>
			</Stack>
		</CardContent>
		{@render carousel()}
		<CardContent>
			<Button type="outlined" text="Open dialog" onclick={() => { dialog_visible = true; }} />
		</CardContent>
	</Card>
</PageContent>

<Dialog bind:visible={dialog_visible} width="600px">
	{#snippet content()}
		{@render carousel()}
	{/snippet}

	{#snippet footer()}
		<form method="dialog">
			<Button autofocus={device.touch} submit type="outlined" text="Close" />
		</form>
	{/snippet}
</Dialog>

{#snippet carousel()}
	<Carousel
		markers={markers ? pages.length : undefined}
		marker_variant={i => variants[i % 5]}
		visible_page={visible_page.current - 1}
	>
		{#each pages as content (content)}
			<div class="page">{content}</div>
		{/each}
	</Carousel>
{/snippet}

<style>
	.page {
		text-align: center;
		font-size: 8rem;
		line-height: 1.2;

		:global(.device-mobile) & {
			font-size: 5rem;
		}
	}
</style>
