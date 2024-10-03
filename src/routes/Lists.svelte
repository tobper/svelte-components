<script lang="ts">
	import {
	    Card,
	    PageHeader,
	    SelectList
	} from '$lib/index.js';
	import { food, get_food_heading, random } from './data.js';

	let value = $state<string | null>(null);
</script>

<article class="page-content" id="list">
	<PageHeader text="List" />
	<Card>
		<div class="flow-items">
			<div class="list-container">
				<h4>Groups</h4>
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
		</div>
	</Card>
</article>

<style>
	.flow-items {
		align-items: flex-start;
	}

	.list-container {
		flex: 1;
		max-width: 20rem;

		:global(.device-mobile &) {
			min-width: 100%;
		}
	}

	output {
		display: block;
		font-style: italic;
		opacity: 60%;
	}
</style>