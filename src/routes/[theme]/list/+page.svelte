<script lang="ts">
	import { Button, Card, CardContent, PageContent, RadioGroup, SelectList, Stack } from '$lib/index.js';
	import { food, fruits, get_food_heading, random } from '../data.js';

	let selected_value = $state<string | null>(null);
	let transition = $state(true)
	let transition_values = $state.raw(random(fruits, 3).toSorted())
</script>

<PageContent header="List">
	<Card>
		<CardContent>
			<div class="list-container">
				<SelectList
					bind:value={selected_value}
					options={random(food, 5)}
					options_heading={get_food_heading}
					options_value={food => food.name}
				/>
				<output>
					Selected: {selected_value ? selected_value : '-'}
				</output>
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
						options={[...transition_values.values()]}
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
</style>
