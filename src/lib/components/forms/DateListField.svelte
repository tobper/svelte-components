<script lang="ts">
	import { get_date_only_key, get_date_today, is_same_date, sort_dates, type DateOnly } from '@tobper/eon';
	import Button from '../Button.svelte';
	import CalendarMenu from '../CalendarMenu.svelte';
	import AddIcon from '../icons/AddIcon.svelte';
	import CalendarIcon from '../icons/CalendarIcon.svelte';
	import ClearIcon from '../icons/ClearIcon.svelte';
	import Field from './Field.svelte';

	interface DateListField {
		dates?: DateOnly[];
		label?: string;
		name?: string;
		readonly?: boolean;
		required?: boolean;
	}

	let {
		dates = $bindable([]),
		label,
		name,
		readonly,
		required,
	}: DateListField = $props();

	let input_element = $state<HTMLElement>();
	let menu_visible = $state(false);

	function is_same_date_as(other: DateOnly) {
		return (date: DateOnly) => is_same_date(date, other);
	}
</script>

<Field {label} {name} {required}>
	{#snippet content({ content_id: button_id, loading, in_progress })}
		<div bind:this={input_element} class="field-content" class:skeleton={loading}>
			<div class="field-input">
				<div class="field-value">
					{#each dates as date, index}
						{@const value = get_date_only_key(date)}

						<input type="hidden" {name} value={value} />

						<Button
							disabled={in_progress || readonly}
							onclick={() => {
								dates = dates.toSpliced(index, 1);
							}}
							text={value}
							variant="delete"
						>
							{#snippet icon()}
								<ClearIcon />
							{/snippet}
						</Button>
					{/each}

					<Button
						disabled={in_progress || readonly}
						id={button_id}
						title="Add date"
						variant="add"
						onclick={() => {
							menu_visible = true;
						}}
					>
						{#snippet icon()}
							<AddIcon />
						{/snippet}
					</Button>
				</div>

				<span class="field-icon">
					<CalendarIcon />
				</span>
			</div>
		</div>

		<CalendarMenu
			bind:visible={menu_visible}
			anchor={input_element}
			keyboard_capture={button_id}
			modal
			selected_date={get_date_today()}
			on_select={selected_date => {
				if (selected_date && !dates.some(is_same_date_as(selected_date)))
					dates = sort_dates([...dates, selected_date]);
			}}
		/>
	{/snippet}
</Field>

<style>
	.field-value {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: var(--space__small);
	}

	.field-input :global(button) {
		height: var(--field-input__height);
		margin: 0;
		padding-inline: 0;
	}
</style>
