<script lang="ts">
	import { Button, Card, Checkbox, CheckboxField, CheckButton, CurrencyField, DateField, DateListField, Form, FormCancelButton, FormError, FormSubmitButton, PageContent, PageHeader, RadioButton, RadioGroup, SelectField, TextField, ToggleSwitch } from '$lib/index.js';
	import { IconCalendarMonth, IconCheck, IconSearch, IconX } from '@tabler/icons-svelte';
	import { get_date_only_key, type DateOnly } from '@tobper/eon';
	import { find_fruit, food, get_food_heading } from './data.js';

	let form_loading = $state(false);
	let field_loading = $state(false);
	let select_value = $state<string | null>(null);
	let auto_complete_value = $state<string | null>(null);
	let currency_value = $state<number | null>(null);
	let date_value = $state<DateOnly | null>(null);
	let dates_value = $state<DateOnly[]>([]);

	let form = $state({
		name: '',
		category: '',
		dates: [],
		select: ''
	})
</script>

<PageContent id="Form">
	<PageHeader text="Text fields" />
	<Card>
		<Form error_message="Form error" field_errors={{ date: ['Invalid date'] }} loading={form_loading}>
			<div class="fields">
				<TextField label="Text" placeholder="Placeholder" required />
				<TextField label="Optional field" value="Lorem ipsum" />
				<TextField label="Disabled" value="Lorem ipsum" disabled required />
				<TextField label="Error" loading={field_loading} name="date" type="search" error_hint suffix_icon={CalendarIcon} required />
				<TextField label="Icon" loading={field_loading} prefix_icon={SearchIcon} placeholder="Search" type="search" required/>
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
				<div class="field-with-output">
					<CurrencyField bind:value={currency_value} label="Currency" required>
						{#snippet suffix_icon()}kr{/snippet}
					</CurrencyField>
					<output>Value: {currency_value === null ? 'null' : currency_value}</output>
				</div>
				<div class="field-with-output">
					<DateField bind:value={date_value} label="Date" required />
					<output>Value: {date_value === null ? 'null' : get_date_only_key(date_value)}</output>
				</div>
				<div class="field-with-output">
					<DateListField bind:dates={dates_value} label="Date list" required />
					<output>Value: {dates_value.map(get_date_only_key).join(', ')}</output>
				</div>
				<div class="field-with-output">
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
				<div class="field-with-output">
					<SelectField
						bind:value={auto_complete_value}
						label="Auto complete"
						options={find_fruit}
						required
						type="autocomplete"
					/>
					<output>Value: {auto_complete_value ? auto_complete_value : '-'}</output>
				</div>
				<CheckboxField label="Checkbox" />
			</div>
			<div class="error">
				<FormError />
			</div>
		</Form>
		<ToggleSwitch label="Form loading" bind:checked={form_loading} />
		<ToggleSwitch label="Field loading" bind:checked={field_loading} />
 	</Card>
</PageContent>

<PageContent>
	<PageHeader text="Form transitions" />
	<Card>
		<Form loading={form_loading} model={form}>
			<div class="fields">
				<TextField label="Name" loading placeholder="Placeholder" required bind:value={form.name} />
				<TextField label="Category" bind:value={form.category} />
				<DateListField label="Date list" required bind:dates={form.dates} />
				<SelectField
					bind:value={form.select}
					label="Select"
					options={food}
					options_heading={get_food_heading}
					options_value={option => option.name}
					type="select"
				/>
			</div>

			{#snippet footer()}
				<FormCancelButton />
				<FormSubmitButton text="Save" />
			{/snippet}
		</Form>
		<div class="flow-items-vertical">
			<ToggleSwitch label="Loading" bind:checked={form_loading} />
			<ToggleSwitch label="Submitting" disabled />
		</div>
	</Card>
</PageContent>

<PageContent>
	<PageHeader text="On / off" />
	<Card>
		<h3>Toggle switch</h3>
		<div class="flow-items-vertical">
			<ToggleSwitch />
			<ToggleSwitch label="Label" />
			<ToggleSwitch disabled label="Disabled" />
			<ToggleSwitch disabled checked label="Disabled checked" />
		</div>

		<h3>Checkbox</h3>
		<div class="flow-items-vertical">
			<Checkbox />
			<Checkbox label="Label" />
			<Checkbox label="Indeterminate" indeterminate={true} />
			<Checkbox disabled label="Disabled" />
			<Checkbox disabled label="Checked and disabled" checked />
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
</PageContent>

{#snippet CalendarIcon()}<IconCalendarMonth />{/snippet}
{#snippet SearchIcon()}<IconSearch />{/snippet}

<style>
	.fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
	}

	.field-with-output {
		align-self: stretch;
		display: flex;
		flex-direction: column;
		gap: .25rem;
	}

	.error {
		margin-top: 1rem;
	}

	output {
		font-style: italic;
		opacity: 60%;
	}
</style>