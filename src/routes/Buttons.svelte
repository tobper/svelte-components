<script lang="ts">
	import ChevronLeftIcon from '$lib/components/icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from '$lib/components/icons/ChevronRightIcon.svelte';
	import ClearIcon from '$lib/components/icons/ClearIcon.svelte';
	import { Button, Card, CardContent, CardHeader, PageContent, type ButtonType, type ButtonVariant } from '$lib/index.js';

	const button_types: [string, ButtonType][] = [
		['Outlined', 'outlined'],
		['Call to action', 'cta'],
		['Plain', 'plain']
	];
	const button_variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'add', 'delete'];
</script>

<PageContent id="Button" header="Button">
	<Card>
		{#each button_types as [heading, type] (heading)}
			<CardHeader text={heading} />

			{#each button_variants as variant (variant)}
				<CardContent horizontal>
					<Button {variant} {type} text="Default" />
					<Button {variant} {type} text="Hover" class="button--hover" />
					<Button {variant} {type} text="Pressed" current />
					<Button {variant} {type} text="Focus" pseudo_focus />
					<Button {variant} {type} text="Icon" icon={ButtonIcon} />
					<Button {variant} {type} text="Disabled" disabled />
					<Button {variant} {type} text="Small" small />

					<div class="flow-items">
						<Button {variant} {type} icon={ButtonIcon} />
						<Button {variant} {type} icon={ButtonIcon} disabled />
					</div>

					<div class="flow-items">
						<Button {variant} {type} icon={ButtonIcon} small />
						<Button {variant} {type} icon={ButtonIcon} disabled small />
					</div>
				</CardContent>
			{/each}
		{/each}

		<CardContent header="Variants" horizontal>
			<Button type="cta" text="Loading" loading />
		</CardContent>

		<CardContent header="Group" horizontal>
			<div class="button-group">
				<Button type="outlined" text="Vegetables" />
				<Button type="outlined" text="Fruits" />
				<Button type="outlined" text="Nuts" />
			</div>
			<div class="button-group">
				<Button type="outlined" icon={ChevronLeft} />
				<Button type="outlined" icon={ChevronRight} />
			</div>
		</CardContent>
	</Card>
</PageContent>

{#snippet ButtonIcon()}<ClearIcon />{/snippet}
{#snippet ChevronLeft()}<ChevronLeftIcon />{/snippet}
{#snippet ChevronRight()}<ChevronRightIcon />{/snippet}
