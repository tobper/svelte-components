<script lang="ts">
	import { Button, Card, CardContent, List, ListItemHeading, ListItemOption, ListItemSeparator, ListItemText, on_resize, PageContent, RadioGroup, SelectList, Stack } from '$lib/index.js';
	import { IconApple, IconCancel, IconCarrot, IconInfoCircle } from '@tabler/icons-svelte-runes';
	import { food, fruits, get_food_heading, random } from '../data.js';

	let selected_value = $state<string | null>(null);
	let transition = $state(true)
	let transition_values = $state.raw(random(fruits, 3).toSorted())
	let item_height_one_line = $state(0)
	let item_height_two_lines = $state(0)
</script>

<PageContent header="List">
	<Card>
		<CardContent>
			<div class="list-container">
				<List>
					<ListItemOption label="Basic option" kbd="space">
						{#snippet details()}
							<!--
						 	Details should be hidden even when a snippet without content exists.
							-->
							{undefined}
						{/snippet}
					</ListItemOption>
					<ListItemOption label="With custom children">
						<ol>
							<li>1. Hello</li>
							<li>2. World</li>
						</ol>
					</ListItemOption>
					<ListItemOption
						label="With details"
						details="Details"
					/>
					<ListItemOption
						label="With icon"
						kbd="esc"
						icon={IconInfoCircle}
					/>
					<ListItemOption
					 	label="With icon and details"
						kbd={['ctrl', 'r']}
						icon={IconInfoCircle}
						details="Lorem ipsum"
					/>
					<ListItemOption
						disabled
						label="Disabled"
						kbd="tab"
						icon={IconCancel}
						details="Not available"
					/>
					<ListItemText text="Text only" />
					<ListItemSeparator />
					<ListItemHeading label="Heading" />
					<ListItemOption label="Parent" />
					<ListItemOption label="Child" indent={1} />
				</List>
			</div>
		</CardContent>
	</Card>
</PageContent>

<PageContent header="SelectList">
	<Card>
		<CardContent>
			<div class="list-container">
				<SelectList
					bind:value={selected_value}
					options={random(food, 5)}
					option_heading={get_food_heading}
					option_icon={({ type }) => type === 'Fruit' ? IconApple : IconCarrot}
					option_value={({ name }) => name}
				/>
				<output>
					Selected: {selected_value ? selected_value : '-'}
				</output>
			</div>
		</CardContent>

		<CardContent header="Virtualized">
			<div class="list-container virtualized">
				<SelectList
					id="virtualized"
					options={Array.from({ length: 9 }, (_, i) => (i + 1))}
					option_heading={value => value < 10 ? `${value * 10}-${(value + 1) * 10}` : undefined}
					option_details={value => (value % 3 === 0) ? 'Details' : undefined}
					option_children={value => (value < 10) ? Array.from({ length: 10 }, (_, i) => value * 10 + i) : []}
					option_icon={value => (value % 2 === 0) ? IconApple : IconCarrot}
					virtualized
				/>
			</div>
		</CardContent>

		<CardContent header="Custom details">
			<div class="list-container virtualized">
				<SelectList
					id="virtualized-custom"
					options={random(food, 10)}
					option_value={({ name }) => name}
					virtualized={{
						item_height: ({ type }) => type === 'Fruit'
							? item_height_one_line
							: item_height_two_lines
					}}
				>
					{#snippet details({ type })}
						{#if type === 'Fruit'}
							One line
						{:else}
							Two<br/>
							Lines
						{/if}
					{/snippet}

					{#snippet templates()}
						<div {@attach on_resize(rect => item_height_one_line = rect.height)}>
							<ListItemOption label="x">
								One line
							</ListItemOption>
						</div>
						<div {@attach on_resize(rect => item_height_two_lines = rect.height)}>
							<ListItemOption label="x">
								Two<br/>
								Lines
							</ListItemOption>
						</div>
					{/snippet}
				</SelectList>
			</div>
		</CardContent>
	</Card>
</PageContent>

<PageContent header="Transitions">
	<Card>
		<CardContent>
			<Stack>
				<Stack horizontal>
					<Button
						text="Add fruit"
						type="outlined"
					 	onclick={() => {
							const available_fruits = fruits.filter(f => !transition_values.includes(f));
							if (available_fruits.length === 0)
								return;

							const new_fruit = available_fruits[~~(available_fruits.length * Math.random())]
							transition_values = transition_values.concat(new_fruit).toSorted()
						}}
					/>
					<RadioGroup
						bind:selected_value={transition}
						buttons={[
							{ text: 'None', value: false },
							{ text: 'Slide', value: true }
						]}
						required
					/>
				</Stack>
				<div class="list-container">
					<SelectList
						options={transition_values}
						transition={transition}
						on_select={value =>
							transition_values = transition_values.filter(v => v !== value)
						}
					/>
				</div>
			</Stack>
		</CardContent>
	</Card>
</PageContent>

<style>
	.list-container {
		min-width: 20rem;

		:global(.device-mobile) & {
			min-width: 100%;
		}
	}

	.virtualized {
		max-height: 200px;
	}
</style>
