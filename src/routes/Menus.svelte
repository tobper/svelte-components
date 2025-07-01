<script lang="ts">
	import MenuItemHeading from '$lib/components/MenuItemHeading.svelte';
	import { Button, Card, CardContent, Menu, MenuItem, MenuItemOption, MenuItemSeparator, PageContent, Stack, unique_id } from '$lib/index.js';
	import { IconCalendarEvent, IconMenu2, IconSearch } from '@tabler/icons-svelte';

	let menu_id = unique_id();
	let menu_trigger_id = unique_id();
	let toggle_1 = $state(true);
	let toggle_2 = $state(false);
	let toggle_radio = $state('radio 1');
</script>

<PageContent id="Menu" header="Menu">
	<Card>
		<CardContent>
			<Stack horizontal>
				<Button id={menu_trigger_id} type="outlined">
					{#snippet icon()}
						<IconMenu2 />
					{/snippet}
				</Button>

				<Menu
					animation="slide"
					id={menu_id}
					trigger={menu_trigger_id}
				>
					<MenuItem
						description="Description"
						icon={search_icon}
						meta="Ctrl + f"
						text="Button"
						on_activate={() =>
							alert('Clicked')
						}
					/>
					<MenuItem
						disabled
						icon={calendar_icon}
						on_activate={() => {
						}}
						text="Button, disabled"
					/>
					<MenuItemSeparator />
					<MenuItemHeading text="Options" />
					<MenuItemOption
						bind:checked={toggle_1}
						text="Check 1"
					/>
					<MenuItemOption
						bind:checked={toggle_2}
						text="Check 2"
					/>
					<MenuItemOption
						disabled
						text="Check 3, disabled"
					/>
					<MenuItemSeparator />
					<MenuItemHeading text="Radio options" />
					<MenuItemOption
						checked={toggle_radio === 'radio 1'}
						text="Radio 1"
						type="radio"
						on_check={() =>
							toggle_radio = 'radio 1'
						}
					/>
					<MenuItemOption
						checked={toggle_radio === 'radio 2'}
						text="Radio 2"
						type="radio"
						on_check={() =>
							toggle_radio = 'radio 2'
						}
					/>
				</Menu>
			</Stack>
		</CardContent>
	</Card>
</PageContent>

{#snippet calendar_icon()}<IconCalendarEvent />{/snippet}
{#snippet search_icon()}<IconSearch />{/snippet}
