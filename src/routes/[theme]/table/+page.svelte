<script lang="ts">
	import { Card, CardHeader, PageContent } from '$lib/index.js';
	import { food, random } from '../data.js';
</script>

<PageContent id="Table" header="Normal table">
	<Card>
		<div class="table">
			<header>
				<div class="table-row">
					<div>Name</div>
					<div>Type</div>
				</div>
			</header>

			<div class="table-body">
				{#each random(food, 6) as { name, type } (name)}
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
</PageContent>

<PageContent header="Table features">
	<Card header="List">
		<div class="table">
			<header>
				<div class="table-row">
					<div>Name</div>
					<div>Type</div>
				</div>
			</header>

			<ul class="table-body">
				{#each random(food, 4) as { name, type } (name)}
					<li class="table-row">
						<div>{name}</div>
						<div>{type}</div>
					</li>
				{/each}
			</ul>
		</div>

		<CardHeader text="Status colors" />
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
</PageContent>

<PageContent header="List">
	<div class="table">
		<header>
			<div class="table-row">
				<div>Name</div>
				<div>Type</div>
			</div>
		</header>

		<ul class="table-body">
			{#each random(food, 4) as { name, type } (name)}
				<li class="table-row">
					<div>{name}</div>
					<div>{type}</div>
				</li>
			{/each}
		</ul>
	</div>
</PageContent>
