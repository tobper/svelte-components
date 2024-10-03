<script lang="ts">
    import ChevronLeftIcon from '$lib/components/icons/ChevronLeftIcon.svelte';
    import ChevronRightIcon from '$lib/components/icons/ChevronRightIcon.svelte';
    import ClearIcon from '$lib/components/icons/ClearIcon.svelte';
    import type { ButtonVariant } from '$lib/index.js';
    import { Button, Card, PageHeader } from '$lib/index.js';

	const button_variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'delete']
</script>

<article class="page-content" id="button">
	<PageHeader text="Button" />
	<Card>
		<h3>Outlined</h3>
		{#each button_variants as variant}
			<div class="flow-items">
				<Button {variant} type="outlined" text="Default" />
				<Button {variant} type="outlined" text="Hover" class="button--hover" />
				<Button {variant} type="outlined" text="Pressed" current />
				<Button {variant} type="outlined" text="Focus" pseudo_focus />
				<Button {variant} type="outlined" text="Small" small />
				<Button {variant} type="outlined" icon={ButtonIcon} />
				<Button {variant} type="outlined" icon={ButtonIcon} small />
				<Button {variant} type="outlined" text="Disabled" disabled />
				<Button {variant} type="outlined" icon={ButtonIcon} disabled />
				<Button {variant} type="outlined" icon={ButtonIcon} disabled small />
			</div>
		{/each}

		<h3>Call to action</h3>
		{#each button_variants as variant}
			<div class="flow-items">
				<Button {variant} type="cta" text="Default" />
				<Button {variant} type="cta" text="Hover" class="button--hover" />
				<Button {variant} type="cta" text="Pressed" current />
				<Button {variant} type="cta" text="Focus" pseudo_focus />
				<Button {variant} type="cta" text="Small" small />
				<Button {variant} type="cta" icon={ButtonIcon} />
				<Button {variant} type="cta" icon={ButtonIcon} small />
				<Button {variant} type="cta" text="Disabled" disabled />
				<Button {variant} type="cta" icon={ButtonIcon} disabled />
				<Button {variant} type="cta" icon={ButtonIcon} disabled small />
			</div>
		{/each}

		<h3>Plain</h3>
		{#each button_variants as variant}
			<div class="flow-items">
				<Button {variant} type="plain" text="Default" />
				<Button {variant} type="plain" text="Hover" class="button--hover" />
				<Button {variant} type="plain" text="Pressed" current />
				<Button {variant} type="plain" text="Focus" pseudo_focus />
				<Button {variant} type="plain" text="Small" small />
				<Button {variant} type="plain" icon={ButtonIcon} />
				<Button {variant} type="plain" icon={ButtonIcon} small />
				<Button {variant} type="plain" text="Disabled" disabled />
				<Button {variant} type="plain" icon={ButtonIcon} disabled />
				<Button {variant} type="plain" icon={ButtonIcon} disabled small />
			</div>
		{/each}

		<h3>Variants</h3>
		<div class="flow-items">
			<Button type="cta" text="Loading" loading />
		</div>

		<h3>Group</h3>
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

{#snippet ButtonIcon()}<ClearIcon />{/snippet}
{#snippet ChevronLeft()}<ChevronLeftIcon />{/snippet}
{#snippet ChevronRight()}<ChevronRightIcon />{/snippet}
