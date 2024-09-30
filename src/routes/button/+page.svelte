<script lang="ts">
    import ChevronLeftIcon from '$lib/components/icons/ChevronLeftIcon.svelte';
    import ChevronRightIcon from '$lib/components/icons/ChevronRightIcon.svelte';
    import ClearIcon from '$lib/components/icons/ClearIcon.svelte';
    import { Button, Card, PageHeader, type ButtonVariant } from '$lib/index.js';

	const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'delete']
</script>

<article class="page-content">
	<PageHeader text="Outlined" />
	<Card>
		{#each variants as variant}
			<div class="flow-items">
				<Button {variant} type="outlined" text="Default" />
				<Button {variant} type="outlined" text="Hover" class="button--hover" />
				<Button {variant} type="outlined" text="Pressed" current />
				<Button {variant} type="outlined" text="Active" active />
				<Button {variant} type="outlined" text="Small" small />
				<Button {variant} type="outlined" icon={ButtonIcon} />
				<Button {variant} type="outlined" icon={ButtonIcon} small />
			</div>
			<div class="flow-items">
				<Button {variant} type="outlined" text="Disabled" disabled />
				<Button {variant} type="outlined" icon={ButtonIcon} disabled />
				<Button {variant} type="outlined" icon={ButtonIcon} disabled small />
			</div>
		{/each}
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Call to action" />
	<Card>
		{#each variants as variant}
			<div class="flow-items">
				<Button {variant} type="cta" text="Default" />
				<Button {variant} type="cta" text="Hover" class="button--hover" />
				<Button {variant} type="cta" text="Pressed" current />
				<Button {variant} type="cta" text="Active" active />
				<Button {variant} type="cta" text="Small" small />
				<Button {variant} type="cta" icon={ButtonIcon} />
				<Button {variant} type="cta" icon={ButtonIcon} small />
			</div>
			<div class="flow-items">
				<Button {variant} type="cta" text="Disabled" disabled />
				<Button {variant} type="cta" icon={ButtonIcon} disabled />
				<Button {variant} type="cta" icon={ButtonIcon} disabled small />
			</div>
		{/each}
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Plain" />
	<Card>
		{#each variants as variant}
			<div class="flow-items">
				<Button {variant} type="plain" text="Default" />
				<Button {variant} type="plain" text="Hover" class="button--hover" />
				<Button {variant} type="plain" text="Pressed" current />
				<Button {variant} type="plain" text="Active" active />
				<Button {variant} type="plain" text="Small" small />
				<Button {variant} type="plain" icon={ButtonIcon} />
				<Button {variant} type="plain" icon={ButtonIcon} small />
			</div>
			<div class="flow-items">
				<Button {variant} type="plain" text="Disabled" disabled />
				<Button {variant} type="plain" icon={ButtonIcon} disabled />
				<Button {variant} type="plain" icon={ButtonIcon} disabled small />
			</div>
	{/each}
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
			<div class="button-group">
				<Button type="outlined" icon={ChevronLeft} />
				<Button type="outlined" icon={ChevronRight} />
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

{#snippet ButtonIcon()}<ClearIcon />{/snippet}
{#snippet ChevronLeft()}<ChevronLeftIcon />{/snippet}
{#snippet ChevronRight()}<ChevronRightIcon />{/snippet}
