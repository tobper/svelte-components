<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { classes } from '../../classes.js';
	import TextField from './TextField.svelte';

	interface CurrencyField {
		class?: string;
		disabled?: boolean;
		error_hint?: ComponentProps<typeof TextField>['error_hint'];
		errors?: string[];
		id?: string;
		label?: string;
		name?: string;
		placeholder?: HTMLInputAttributes['placeholder'];
		readonly?: boolean;
		required?: boolean;
		value?: number | null;

		icon?: ComponentProps<typeof TextField>['icon'];
		prefix?: ComponentProps<typeof TextField>['prefix'];
		suffix?: ComponentProps<typeof TextField>['suffix'];
	}

	let {
		value: props_value = $bindable(null),
		...text_field_props
	}: CurrencyField = $props();

	let focused = $state(false);
	let input_selection_direction = $state<HTMLInputElement['selectionDirection']>(null);
	let input_selection_start = $state<HTMLInputElement['selectionStart']>(null);
	let input_selection_end = $state<HTMLInputElement['selectionEnd']>(null);
	let input_value = $state('');
	let input_value_previous = $state('');

	// `input_value_previous` is used to avoid a circular update of `value` and `input_value`
	// Updating `value` from outside the component should automatically update `input_value`
	// If `input_value` equals `input_value_previous` then the value was changed from the outside
	// If they don't match it means the value was changed by the user
	$effect(() => {
		if (input_value === input_value_previous) {
			input_value = focused ? format_as_number(props_value) : format_as_pretty_text(props_value);
			input_value_previous = input_value;
		}
		else {
			props_value = parse_as_number(input_value);
			input_value_previous = input_value;
		}
	});

	function format_as_pretty_text(value: number | null) {
		if (value === null)
			return '';

		return value
			.toLocaleString('sv-SE', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
			.replace('−', '-')
			.replace(/,00$/, '');
	}

	function format_as_number(value: number | null) {
		if (value === null)
			return '';
	
		return value.toString();
	}

	function parse_as_number(text: string) {
		if (text === '')
			return null;

		const amount = +(text.replace(',', '.'));
		if (isNaN(amount))
			return null;

		return amount;
	}

	function parse_as_text(text: string) {
		// Parse text excluding extra trailing digits
		const match = text.match(/^(-?(\d+([\\.,]\d{0,2})?)?)\d*$/);

		return match
			? { valid: true as const, value: match[1] }
			: { valid: false as const };
	}
</script>

<TextField
	bind:focused
	{...text_field_props}
	input_class={classes({
		'currency__negative': !focused && props_value !== null && props_value < 0,
		'currency__positive': !focused && props_value !== null && props_value > 0,
	})}
	value={input_value}
	oninput={event => {
		const { currentTarget: input } = event;
		const new_text = parse_as_text(input.value);

		if (new_text.valid) {
			input_value = new_text.value;
			input_selection_direction = input.selectionDirection;
			input_selection_start = input.selectionStart;
			input_selection_end = input.selectionEnd;
		}
		else {
			// Reset value and selection to before change
			input.value = input_value;
			input.selectionStart = input_selection_start;
			input.selectionEnd = input_selection_end;
			input.selectionDirection = input_selection_direction;
		}
	}}
	onkeydown={event => {
		const { key, altKey, ctrlKey, metaKey, currentTarget: input } = event;

		if (key === '-' && !altKey && !ctrlKey && !metaKey) {
			event.preventDefault();

			const was_positive = input.value[0] !== '-';

			// Adjust selection for the changed negative sign
			input_value = was_positive
				? '-' + input.value
				: input.value.slice(1);
			input_selection_start = input_selection_start !== null
				? Math.max(input_selection_start + (was_positive ? 1 : -1), 0)
				: input_value.length;
			input_selection_end = input_selection_end !== null
				? Math.max(input_selection_end + (was_positive ? 1 : -1), 0)
				: input_value.length;

			// Direction is reset when start/end is updated so reset it last
			input.value = input_value;
			input.selectionStart = input_selection_start;
			input.selectionEnd = input_selection_end;
			input.selectionDirection = input_selection_direction;
		}
	}}
	onpaste={event => {
		const { currentTarget: input, clipboardData } = event;
		const data = clipboardData?.getData('text/plain');
		if (data === undefined)
			return;

		event.preventDefault();

		const pasted_text = data.replace(/\s/g, ''); // Remove whitespace from pasted text
		const parsed_text = parse_as_text(
			input.value.slice(0, input_selection_start ?? 0) +
			pasted_text +
			input.value.slice(input_selection_end ?? input.value.length)
		);

		if (parsed_text.valid) {
			input_value = parsed_text.value;
			input_selection_direction = 'forward';
			input_selection_start = (input_selection_start ?? 0) + pasted_text.length;
			input_selection_end = input_selection_start;

			input.value = input_value;
			input.selectionStart = input_selection_start;
			input.selectionEnd = input_selection_end;
			input.selectionDirection = input_selection_direction;
		}
	}}
	onselectionchange={({ currentTarget: input }) => {
		input_selection_direction = input.selectionDirection;
		input_selection_start = input.selectionStart;
		input_selection_end = input.selectionEnd;
	}}
/>
