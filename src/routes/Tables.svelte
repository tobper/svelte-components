<script lang="ts">
	import { Card, PageHeader } from '$lib/index.js';
	import { fruits, vegetables } from './data.js';
	 
	const food =
		[
			...vegetables.map(name => ({ name, type: 'Vegetable' })),
			...fruits.map(name => ({ name, type: 'Fruit' }))
		]
		.toSorted((x, y) => x.name < y.name ? -1 : x.name > y.name ? 1 : 0)
		.slice(0, 6);
</script>

<article class="page-content" id="table">
	<PageHeader text="Normal table" />
	<Card>
		<div class="table">
			<header>
				<div class="table-row">
					<div>Name</div>
					<div>Type</div>
				</div>
			</header>

			<div class="table-body">
				{#each food as { name, type }}
					<div class="table-row">
						<div>{name}</div>
						<div>{type}</div>
					</div>
				{/each}
			</div>

			<footer>
				<div class="table-row">
					<div>Total: {food.length}</div>
					<div></div>
				</div>
			</footer>
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Table with status rows" />
	<Card>
		<div class="table">
			<header>
				<div class="table-row">
					<div>Status</div>
				</div>
			</header>

			<div class="table-body">
				<div class="table-row table-row--info">
					<div>Info</div>
				</div>
				<div class="table-row table-row--info">
					<div>Info</div>
				</div>
				<div class="table-row table-row--error">
					<div>Error</div>
				</div>
				<div class="table-row table-row--error">
					<div>Error</div>
				</div>
				<div class="table-row table-row--warning">
					<div>Warning</div>
				</div>
				<div class="table-row table-row--warning">
					<div>Warning</div>
				</div>
				<div class="table-row table-row--success">
					<div>Success</div>
				</div>
				<div class="table-row table-row--success">
					<div>Success</div>
				</div>
			</div>
		</div>
	</Card>
</article>
