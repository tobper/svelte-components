<script lang="ts">
	import { Card, CardContent, PageContent, PopoverButton, SelectMenu, unique_id } from '$lib/index.js';
	import { IconFilter, IconFilterDown } from '@tabler/icons-svelte';

	let button_id = unique_id();
	let menu_id = unique_id();
</script>

<PageContent id="Menu" header="Menu">
	<Card>
		<CardContent>
			<PopoverButton animation="rotate" id={button_id} popover={menu_id}>
				{#snippet content(state)}
					{#if state === 'closed'}
						<IconFilter />
					{:else}
						<IconFilterDown />
					{/if}
				{/snippet}
			</PopoverButton>
			<SelectMenu
				anchor={button_id}
				animation="slide"
				id={menu_id}
				options={['Foo', 'Bar', 'Baz']}
			/>
		</CardContent>
	</Card>
</PageContent>
