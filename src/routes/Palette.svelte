<script lang="ts">
	import { Card, PageHeader } from '$lib/index.js';
</script>

<article class="page-content" id="palette">
	<PageHeader text="Palette" />
	<Card>
		<h3>Variant</h3>
		<div class="flow-items">
			<div class="status primary">Primary</div>
			<div class="status secondary">Secondary</div>
			<div class="status tertiary">Tertiary</div>
			<div class="status add">Add</div>
			<div class="status delete">Delete</div>
		</div>

		<h3>Status</h3>
		<div class="flow-items">
			<div class="status status-error">Error</div>
			<div class="status status-info">Information</div>
			<div class="status status-success">Success</div>
			<div class="status status-warning">Warning</div>
		</div>
	</Card>
</article>

<style>
	.status {
		border-style: solid;
		border-width: 1px;
		border-radius: .25rem;
		padding: 1rem;
	}

	.status.primary {
		color: var(--palette__text--inverted);
		background: var(--palette__primary-background);
		border-color: transparent;
	}

	.status.secondary {
		color: var(--palette__text--inverted);
		background: var(--palette__secondary-background);
		border-color: transparent;
	}

	.status.tertiary {
		color: var(--palette__text--inverted);
		background: var(--palette__tertiary-background);
		border-color: transparent;
	}

	.status.add {
		color: var(--palette__text--inverted);
		background: var(--palette__variant-add-background);
		border-color: transparent;
	}

	.status.delete {
		color: var(--palette__text--inverted);
		background: var(--palette__variant-delete-background);
		border-color: transparent;
	}
</style>