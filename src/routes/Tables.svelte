<script lang="ts">
	import { Card, PageHeader } from '$lib/index.js';
	import { food, random } from './data.js';
</script>

<article class="page-content" id="Table">
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
				{#each random(food, 6) as { name, type }}
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
	<PageHeader text="Table features" />
	<Card>
		<h3>List</h3>
		<div class="table">
			<header>
				<div class="table-row">
					<div>Name</div>
					<div>Type</div>
				</div>
			</header>

			<ul class="table-body">
				{#each random(food, 4) as { name, type }}
					<li class="table-row">
						<div>{name}</div>
						<div>{type}</div>
					</li>
				{/each}
			</ul>
		</div>

		<h3>Status colors</h3>
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

<article class="page-content">
	<PageHeader text="List" />
	<div class="table">
		<header>
			<div class="table-row">
				<div>Name</div>
				<div>Type</div>
			</div>
		</header>

		<ul class="table-body">
			{#each random(food, 4) as { name, type }}
				<li class="table-row">
					<div>{name}</div>
					<div>{type}</div>
				</li>
			{/each}
		</ul>
	</div>
</article>
