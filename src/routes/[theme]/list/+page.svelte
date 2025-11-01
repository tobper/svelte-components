<script lang="ts">
	import { Card, CardContent, PageContent, SelectList } from '$lib/index.js';
	import { food, get_food_heading, random } from '../data.js';

	let value = $state<string | null>(null);
</script>

<PageContent header="List">
	<Card>
		<CardContent>
			<div class="list-container">
				<SelectList
					bind:value
					options={random(food, 5)}
					options_heading={get_food_heading}
					options_value={food => food.name}
				/>
				<output>
					Selected: {value ? value : '-'}
				</output>
			</div>
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
