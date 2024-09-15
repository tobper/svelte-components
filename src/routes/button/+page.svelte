<script lang="ts">
	import { Button, Card, PageHeader } from '$lib/index.js';
</script>

<article class="page-content">
	<PageHeader text="Outlined" />
	<Card>
		<div class="flow-items">
			<Button type="outlined" text="Default" />
			<Button type="outlined" text="Hover" class="button--hover" />
			<Button type="outlined" text="Pressed" class="button--pressed" />
			<Button type="outlined" text="Disabled" disabled />
			<!-- <Button type="outlined" text="Icon" icon="avatar" /> -->
			<Button type="outlined" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="outlined" variant="secondary" text="Default" />
			<Button type="outlined" variant="secondary" text="Hover" class="button--hover" />
			<Button type="outlined" variant="secondary" text="Pressed" class="button--pressed" />
			<Button type="outlined" variant="secondary" text="Disabled" disabled />
			<!-- <Button type="outlined" variant="secondary" text="Icon" icon="delete" /> -->
			<Button type="outlined" variant="secondary" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="outlined" variant="tertiary" text="Default" />
			<Button type="outlined" variant="tertiary" text="Hover" class="button--hover" />
			<Button type="outlined" variant="tertiary" text="Pressed" class="button--pressed" />
			<Button type="outlined" variant="tertiary" text="Disabled" disabled />
			<!-- <Button type="outlined" variant="tertiary" text="Icon" icon="delete" /> -->
			<Button type="outlined" variant="tertiary" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="outlined" variant="delete" text="Default" />
			<Button type="outlined" variant="delete" text="Hover" class="button--hover" />
			<Button type="outlined" variant="delete" text="Pressed" class="button--pressed" />
			<Button type="outlined" variant="delete" text="Disabled" disabled />
			<!-- <Button type="outlined" variant="delete" text="Icon" icon="delete" /> -->
			<Button type="outlined" variant="delete" text="Small" small />
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Call to action" />
	<Card>
		<div class="flow-items">
			<Button type="cta" text="Default" />
			<Button type="cta" text="Hover" class="button--hover" />
			<Button type="cta" text="Pressed" class="button--pressed" />
			<Button type="cta" text="Disabled" disabled />
			<!-- <Button type="cta" submit text="Icon" icon="save" /> -->
			<Button type="cta" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="cta" variant="secondary" text="Default" />
			<Button type="cta" variant="secondary" text="Hover" class="button--hover" />
			<Button type="cta" variant="secondary" text="Pressed" class="button--pressed" />
			<Button type="cta" variant="secondary" text="Disabled" disabled />
			<!-- <Button type="cta" variant="secondary" text="Icon" icon="delete" /> -->
			<Button type="cta" variant="secondary" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="cta" variant="tertiary" text="Default" />
			<Button type="cta" variant="tertiary" text="Hover" class="button--hover" />
			<Button type="cta" variant="tertiary" text="Pressed" class="button--pressed" />
			<Button type="cta" variant="tertiary" text="Disabled" disabled />
			<!-- <Button type="cta" variant="tertiary" text="Icon" icon="delete" /> -->
			<Button type="cta" variant="tertiary" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="cta" variant="delete" text="Default" />
			<Button type="cta" variant="delete" text="Hover" class="button--hover" />
			<Button type="cta" variant="delete" text="Pressed" class="button--pressed" />
			<Button type="cta" variant="delete" text="Disabled" disabled />
			<!-- <Button type="cta" variant="delete" text="Icon" icon="delete" /> -->
			<Button type="cta" variant="delete" text="Small" small />
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Plain" />
	<Card>
		<div class="flow-items">
			<Button type="plain" text="Default" />
			<Button type="plain" text="Hover" class="button--hover" />
			<Button type="plain" text="Pressed" class="button--pressed" />
			<Button type="plain" text="Disabled" disabled />
			<!-- <Button type="plain" text="Icon" icon="arrow-left" /> -->
			<Button type="plain" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="plain" variant="secondary" text="Default" />
			<Button type="plain" variant="secondary" text="Hover" class="button--hover" />
			<Button type="plain" variant="secondary" text="Pressed" class="button--pressed" />
			<Button type="plain" variant="secondary" text="Disabled" disabled />
			<!-- <Button type="plain" variant="secondary" text="Icon" icon="arrow-right" /> -->
			<Button type="plain" variant="secondary" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="plain" variant="tertiary" text="Default" />
			<Button type="plain" variant="tertiary" text="Hover" class="button--hover" />
			<Button type="plain" variant="tertiary" text="Pressed" class="button--pressed" />
			<Button type="plain" variant="tertiary" text="Disabled" disabled />
			<!-- <Button type="plain" variant="tertiary" text="Icon" icon="arrow-right" /> -->
			<Button type="plain" variant="tertiary" text="Small" small />
		</div>
		<div class="flow-items">
			<Button type="plain" variant="delete" text="Default" />
			<Button type="plain" variant="delete" text="Hover" class="button--hover" />
			<Button type="plain" variant="delete" text="Pressed" class="button--pressed" />
			<Button type="plain" variant="delete" text="Disabled" disabled />
			<!-- <Button type="plain" variant="delete" text="Icon" icon="arrow-right" /> -->
			<Button type="plain" variant="delete" text="Small" small />
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Button group" />
	<Card>
		<div class="flow-items">
			<div class="button-group">
				<Button type="outlined" text="Vegetables" />
				<Button type="outlined" text="Fruits" />
				<Button type="outlined" text="Nuts" />
			</div>
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Custom" />
	<Card>
		<h3>Loading</h3>
		<div class="flow-items">
			<Button type="cta" text="Logging in" loading />
		</div>
	</Card>
</article>
