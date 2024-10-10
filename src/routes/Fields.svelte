<script lang="ts">
	import { Button, Card, CheckButton, CurrencyField, DateField, DateListField, Form, PageHeader, RadioButton, RadioGroup, SelectField, TextField, ToggleSwitch } from '$lib/index.js';
	import { IconCalendar, IconCheck, IconSearch, IconX } from '@tabler/icons-svelte';
	import { get_date_only_key, type DateOnly } from '@tobper/eon';
	import { food, fruits, get_food_heading } from './data.js';

	let form_loading = $state(false);
	let select_value = $state<string | null>(null);
	let auto_complete_value = $state<string | null>(null);
	let currency_value = $state<number | null>(null);
	let date_value = $state<DateOnly | null>(null);
	let dates_value = $state<DateOnly[]>([]);
</script>

<article class="page-content" id="form">
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
				<div class="field">
					<CurrencyField bind:value={currency_value} label="Currency" required>
						{#snippet icon()}kr{/snippet}
					</CurrencyField>
					<output>Value: {currency_value === null ? 'null' : currency_value}</output>
				</div>
				<div class="field">
					<DateField bind:value={date_value} label="Date" required />
					<output>Value: {date_value === null ? 'null' : get_date_only_key(date_value)}</output>
				</div>
				<div class="field">
					<DateListField bind:dates={dates_value} label="Date list" required />
					<output>Value: {dates_value.map(get_date_only_key).join(', ')}</output>
				</div>
				<div class="field">
					<SelectField
						bind:value={select_value}
						label="Select"
						options={food}
						options_heading={get_food_heading}
						options_value={option => option.name}
						required
						type="select"
					/>
					<output>Value: {select_value ? select_value : '-'}</output>
				</div>
				<div class="field">
					<SelectField
						bind:value={auto_complete_value}
						label="Auto complete"
						options={fruits}
						required
						type="autocomplete"
					/>
					<output>Value: {auto_complete_value ? auto_complete_value : '-'}</output>
				</div>
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
				<DateListField label="Date list" required />
				<SelectField
					label="Select"
					options={food}
					options_heading={get_food_heading}
					options_value={option => option.name}
					type="select"
				/>
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
	<PageHeader text="On / off" />
	<Card>
		<h3>Toggle switch</h3>
		<div class="flow-items-vertical">
			<ToggleSwitch label="Default" />
			<ToggleSwitch disabled label="Disabled" />
			<ToggleSwitch disabled checked label="Disabled checked" />
		</div>

		<h3>Check button</h3>
		<div class="flow-items">
			<CheckButton text="Default" />
			<CheckButton text="Checked" checked />
			<CheckButton disabled text="Disabled" />
			<CheckButton disabled text="Checked and disabled" checked />
		</div>

		<h4>Group</h4>
		<div class="flow-items">
			<div class="button-group">
				<CheckButton text="Yes" checked />
				<CheckButton text="No" />
				<CheckButton text="Maybe" />
			</div>
		</div>

		<h4>Animated</h4>
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

		<h3>Radio button</h3>
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

{#snippet CalendarIcon()}<IconCalendar />{/snippet}
{#snippet SearchIcon()}<IconSearch />{/snippet}

<style>
	.fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
	}

	.field {
		align-self: stretch;
		display: flex;
		flex-direction: column;
		gap: .25rem;
	}

	output {
		font-style: italic;
		opacity: 60%;
	}
</style>