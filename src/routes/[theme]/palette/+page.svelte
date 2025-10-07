<script lang="ts">
	import { Card, CardContent, PageContent } from '$lib/index.js';

	const variants = ['Primary', 'Secondary', 'Tertiary', 'Add', 'Delete'];
</script>

<PageContent header="Palette">
	<Card>
		{#each variants as variant (variant)}
			<CardContent header={variant} horizontal class={`variant-${variant.toLowerCase()}`}>
				<div class="accent">Base</div>
				<div class="accent accent-color">Color</div>
				<div class="accent accent-background">Background</div>
				<div class="accent accent-background-hover">Hover</div>
				<div class="accent accent-background-inset">Inset</div>
				<div class="accent accent-background-contrast">Contrast</div>
			</CardContent>
		{/each}
	</Card>

	<Card header="Status">
		<CardContent horizontal>
			<div class="status status-error">Error</div>
			<div class="status status-info">Information</div>
			<div class="status status-success">Success</div>
			<div class="status status-warning">Warning</div>
		</CardContent>
	</Card>

	<Card>
		<CardContent header="Shadows" horizontal>
			<div class="shadow">None</div>
			<div class="shadow" style:box-shadow="var(--shadow__distinct)">Distinct</div>
			<div class="shadow" style:box-shadow="var(--shadow__small)">Small</div>
			<div class="shadow" style:box-shadow="var(--shadow__medium)">Medium</div>
			<div class="shadow" style:box-shadow="var(--shadow__large)">Large</div>
		</CardContent>

		<CardContent header="Raised" horizontal>
			<div class="shadow" style:box-shadow="var(--shadow__inset)">Inset</div>
			<div class="shadow" style:box-shadow="var(--shadow__highlight), var(--shadow__distinct)">Distinct</div>
			<div class="shadow" style:box-shadow="var(--shadow__highlight), var(--shadow__small)">Small</div>
			<div class="shadow" style:box-shadow="var(--shadow__highlight), var(--shadow__medium)">Medium</div>
			<div class="shadow" style:box-shadow="var(--shadow__highlight), var(--shadow__large)">Large</div>
		</CardContent>
	</Card>
</PageContent>

<style>
	.accent {
		color: var(--palette__text--inverted);
		background: var(--palette__accent);
		border-radius: var(--border-radius__small);
		padding: var(--space);
		width: 8rem;
	}

	.accent-color {
		background: var(--palette__accent-color);
	}

	.accent-background {
		background: var(--palette__accent-background);
	}

	.accent-background-hover {
		background: var(--palette__accent-background--hover);
	}

	.accent-background-inset {
		background: var(--palette__accent-background--inset);
	}

	.accent-background-contrast {
		background: var(--palette__accent-contrast);
	}

	.status {
		border-style: solid;
		border-width: 1px;
		border-radius: var(--border-radius__small);
		padding: var(--space);
		width: 8rem;
	}

	.shadow {
		border-radius: var(--border-radius__small);
		background-color: var(--palette__background_light);
		padding: 1rem;
		width: 6rem;
	}
</style>
