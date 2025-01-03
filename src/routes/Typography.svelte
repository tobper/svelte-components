<script lang="ts">
	import { Card, CardContent, PageContent } from '$lib/index.js';
</script>

<PageContent id="Typography" header="Typography">
	<Card>
		<CardContent>
			<h1>Header 1</h1>
			<h2>Header 2</h2>
			<h3>Header 3</h3>
			<h4>Header 4</h4>
			<div>Strong text</div>
			<div class="weak">Weak text</div>
			<div class="disabled">Disabled text</div>
		</CardContent>
	</Card>
</PageContent>

<style>
	.weak {
		color: var(--palette__text--weak);
	}

	.disabled {
		color: var(--palette__text--disabled);
	}
</style>