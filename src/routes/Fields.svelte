<script lang="ts">
	import { Button, Card, CardContent, CardFooter, Checkbox, CheckboxField, CheckButton, CurrencyField, DateField, Form, FormCancelButton, FormError, FormSubmitButton, PageContent, RadioButton, RadioGroup, SelectField, TextField, ToggleSwitch } from '$lib/index.js';
	import { IconCalendarMonth, IconCheck, IconSearch, IconX } from '@tabler/icons-svelte';
	import { get_date_only_key, get_date_today, type DateOnly } from '@tobper/eon';
	import { find_fruit, food, get_food_heading } from './data.js';

	let form_loading = $state(false);
	let field_loading = $state(false);
	let select_few_value = $state<string | null>(null);
	let select_many_value = $state<string | null>(null);
	let auto_complete_value = $state<string | null>(null);
	let currency_value = $state<number | null>(null);
	let date_value = $state<DateOnly | null>(get_date_today());
	let dates_value = $state<DateOnly[]>([get_date_today()]);

	let form = $state({
		name: '',
		category: '',
		dates: [],
		select: ''
	})
</script>

<PageContent id="Form" header="Text fields">
	<Card>
		<Form error_message="Form error" field_errors={{ date: ['Invalid date'] }} loading={form_loading}>
			<CardContent fill>
				<div class="fields">
					<TextField label="Text" placeholder="Placeholder" required />
					<TextField label="Optional field" value="Lorem ipsum" />
					<TextField label="Disabled" value="Lorem ipsum" disabled required />
					<TextField label="Error" loading={field_loading} name="date" type="search" error_hint suffix_icon={calendar_icon} required />
					<TextField label="Icon" loading={field_loading} prefix_icon={search_icon} placeholder="Search" type="search" required/>
					<TextField label="Loading" loading type="search" required />
					<TextField label="Prefix" placeholder="Name" required>
						{#snippet prefix()}
							<Button text="Option" type="plain" />
						{/snippet}
					</TextField>
					<TextField label="Suffix" placeholder="Find" required>
						{#snippet suffix()}
							<Button submit icon={search_icon} />
						{/snippet}
					</TextField>
					<div class="field-with-output">
						<CurrencyField bind:value={currency_value} label="Currency" required>
							{#snippet suffix_icon()}kr{/snippet}
						</CurrencyField>
						<output>
							Value: {currency_value === null ? '-' : currency_value}
						</output>
					</div>
					<div class="field-with-output">
						<DateField bind:value={date_value} label="Date" name="date_single" required />
						<output>
							Value: {date_value === null ? '-' : get_date_only_key(date_value)}
						</output>
					</div>
					<div class="field-with-output">
						<DateField bind:value={dates_value} label="Date list" name="date_many" required />
						<output>
							Value: {dates_value.map(get_date_only_key).join(', ')}
						</output>
					</div>
					<div class="field-with-output">
						<SelectField
							bind:value={select_few_value}
							label="Select (few items)"
							options={['Orange', 'Red', 'Blue']}
							required
							type="select"
						/>
						<output>
							Value: {select_few_value ?? '-'}
						</output>
					</div>
					<div class="field-with-output">
						<SelectField
							bind:value={select_many_value}
							label="Select (many items)"
							options={food}
							options_heading={get_food_heading}
							options_value={option => option.name}
							required
							type="select"
						/>
						<output>
							Value: {select_many_value ?? '-'}
						</output>
					</div>
					<div class="field-with-output">
						<SelectField
							bind:value={auto_complete_value}
							label="Auto complete"
							options={find_fruit}
							required
							type="autocomplete"
						/>
						<output>
							Value: {auto_complete_value ? auto_complete_value : '-'}
						</output>
					</div>
					<CheckboxField label="Checkbox" />
				</div>
				<div class="error">
					<FormError />
				</div>
			</CardContent>
			<CardContent horizontal>
				<ToggleSwitch label="Form loading" bind:checked={form_loading} />
				<ToggleSwitch label="Field loading" bind:checked={field_loading} />
			</CardContent>
		</Form>
 	</Card>
</PageContent>

<PageContent header="Form transitions">
	<Card>
		<Form loading={form_loading} model={form}>
			<CardContent fill>
				<div class="fields">
					<TextField label="Name" loading placeholder="Placeholder" required bind:value={form.name} />
					<TextField label="Category" bind:value={form.category} />
					<DateField label="Date list" required bind:value={form.dates} />
					<SelectField
						bind:value={form.select}
						label="Select"
						options={food}
						options_heading={get_food_heading}
						options_value={option => option.name}
						type="select"
					/>
				</div>
			</CardContent>
			<CardContent>
				<ToggleSwitch label="Loading" bind:checked={form_loading} />
			</CardContent>
			<CardFooter>
				<FormCancelButton />
				<FormSubmitButton text="Save" />
			</CardFooter>
		</Form>
	</Card>
</PageContent>

<PageContent header="On / off">
	<Card>
		<CardContent header="Toggle switch">
			<ToggleSwitch />
			<ToggleSwitch label="Label" />
			<ToggleSwitch label="Label" description="Extra long description for switch" />
			<ToggleSwitch disabled label="Disabled" />
			<ToggleSwitch disabled checked label="Disabled checked" />
		</CardContent>

		<CardContent header="Checkbox">
			<Checkbox />
			<Checkbox label="Label" />
			<Checkbox label="Indeterminate" indeterminate={true} />
			<Checkbox disabled label="Disabled" />
			<Checkbox disabled label="Checked and disabled" checked />
		</CardContent>

		<CardContent header="Check button">
			<div class="flow-items">
				<CheckButton text="Default" />
				<CheckButton text="Checked" checked />
				<CheckButton disabled text="Disabled" />
				<CheckButton disabled text="Checked and disabled" checked />
			</div>

			<h4>Group</h4>
			<div class="button-group">
				<CheckButton text="Yes" checked />
				<CheckButton text="No" />
				<CheckButton text="Maybe" />
			</div>

			<h4>Animated</h4>
			<div class="flow-items">
				<CheckButton animation="fade" text="Fade" content={checked_icon} />
				<CheckButton animation="fade" content={checked_icon} />
				<CheckButton animation="flip" text="Flip" content={checked_icon} />
				<CheckButton animation="flip" content={checked_icon} />
				<CheckButton animation="rotate" text="Rotate" content={checked_icon} />
				<CheckButton animation="rotate" content={checked_icon} />
			</div>
		</CardContent>

		<CardContent header="Radio button">
			<RadioGroup required selected_value="yes">
				<RadioButton value="yes" text="Yes" />
				<RadioButton value="no" text="No" />
				<RadioButton value="maybe" text="Maybe" />
			</RadioGroup>

			<h4>Optional</h4>
			<RadioGroup>
				<RadioButton value="true" text="Finished" />
				<RadioButton value="false" text="Not finished" />
			</RadioGroup>

			<h4>Disabled</h4>
			<RadioGroup disabled selected_value="1">
				<RadioButton value="1" text="Disabled 1" />
				<RadioButton value="2" text="Disabled 2" />
			</RadioGroup>
		</CardContent>
	</Card>
</PageContent>

{#snippet calendar_icon()}<IconCalendarMonth />{/snippet}
{#snippet search_icon()}<IconSearch />{/snippet}
{#snippet checked_icon(checked: boolean)}
	{@const Icon = checked ? IconCheck : IconX}
	<Icon />
{/snippet}

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
</style>
