<script lang="ts">
	import { Button, Card, CheckButton, Form, PageHeader, RadioButton, RadioGroup, TextField, ToggleSwitch } from '$lib/index.js';
	import { IconCalendar, IconCheck, IconSearch, IconX } from '@tabler/icons-svelte';

	let form_loading = $state(false);
</script>

{#snippet CalendarIcon()}<IconCalendar />{/snippet}
{#snippet SearchIcon()}<IconSearch />{/snippet}

<article class="page-content">
	<PageHeader text="Text fields" />
	<Card>
		<Form field_errors={{ date: ['Invalid date'] }}>
			<div class="fields">
				<TextField label="Text" placeholder="Placeholder" required />
				<TextField label="Optional field" value="Lorem ipsum" />
				<TextField label="Disabled" value="Lorem ipsum" disabled required />
				<TextField label="Error" name="date" type="search" error_hint icon={CalendarIcon} required />
				<TextField label="Icon" icon={SearchIcon} placeholder="Search" type="search" required/>
				<TextField label="Loading" loading type="search" required />
				<TextField label="Prefix" placeholder="Name" required>
					{#snippet prefix()}
						<Button text="Option" type="plain" />
					{/snippet}
				</TextField>
				<TextField label="Suffix" placeholder="Find" required>
					{#snippet suffix()}
						<Button submit icon={SearchIcon} />
					{/snippet}
				</TextField>
			</div>
		</Form>
 	</Card>
</article>

<article class="page-content">
	<PageHeader text="Form transitions" />
	<Card>
		<Form loading={form_loading}>
			<div class="fields">
				<TextField label="Name" loading placeholder="Placeholder" required />
				<TextField label="Category" />
			</div>

			{#snippet footer({ loading, submitting })}
				<Button disabled={submitting} text="Cancel" />
				<Button disabled={submitting || loading} text="Save" submit type="cta"/>
			{/snippet}
		</Form>
		<div class="flow-items-vertical">
			<ToggleSwitch label="Loading" bind:checked={form_loading} />
			<ToggleSwitch label="Submitting" disabled />
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Toggle switch" />
	<Card>
		<div class="flow-items-vertical">
			<ToggleSwitch label="Default" />
			<ToggleSwitch disabled label="Disabled" />
			<ToggleSwitch disabled checked label="Disabled checked" />
		</div>
 	</Card>
</article>

<article class="page-content">
	<PageHeader text="Check button" />
	<Card>
		<div class="flow-items">
			<CheckButton text="Default" />
			<CheckButton text="Checked" checked />
			<CheckButton disabled text="Disabled" />
			<CheckButton disabled text="Checked and disabled" checked />
		</div>

		<h3>Group</h3>
		<div class="flow-items">
			<div class="button-group">
				<CheckButton text="Yes" checked />
				<CheckButton text="No" />
				<CheckButton text="Maybe" />
			</div>
		</div>

		<h3>Animated</h3>
		<div class="flow-items">
			<CheckButton animation="fade" text="Fade" content={icon_content} />
			<CheckButton animation="fade" content={icon_content} />
			<CheckButton animation="flip" text="Flip" content={icon_content} />
			<CheckButton animation="flip" content={icon_content} />
			<CheckButton animation="rotate" text="Rotate" content={icon_content} />
			<CheckButton animation="rotate" content={icon_content} />

			{#snippet icon_content(checked: boolean)}
				{@const Icon = checked ? IconCheck : IconX}
				<Icon />
			{/snippet}
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Radio button" />
	<Card>
		<div class="flow-items">
			<RadioGroup selected_value="yes">
				<RadioButton value="yes" text="Yes" />
				<RadioButton value="no" text="No" />
				<RadioButton value="maybe" text="Maybe" />
			</RadioGroup>
		</div>
		<div class="flow-items">
			<RadioGroup disabled selected_value="1">
				<RadioButton value="1" text="Disabled 1" />
				<RadioButton value="2" text="Disabled 2" />
			</RadioGroup>
		</div>
	</Card>
</article>

<style>
	.fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
	}
</style>