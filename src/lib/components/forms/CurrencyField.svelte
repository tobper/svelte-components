<script lang="ts">
	import { untrack, type ComponentProps } from 'svelte';
	import TextField from './TextField.svelte';

	type TextFieldProps = ComponentProps<typeof TextField>;

	interface CurrencyField {
		value?: number | null;

		autofocus?: TextFieldProps['autofocus'];
		class?: TextFieldProps['class'];
		disabled?: TextFieldProps['disabled'];
		error_hint?: TextFieldProps['error_hint'];
		errors?: TextFieldProps['errors'];
		id?: TextFieldProps['id'];
		label?: TextFieldProps['label'];
		name?: TextFieldProps['name'];
		placeholder?: TextFieldProps['placeholder'];
		readonly?: TextFieldProps['readonly'];
		required?: TextFieldProps['required'];
		title?: TextFieldProps['title'];

		prefix?: TextFieldProps['prefix'];
		prefix_icon?: TextFieldProps['prefix_icon'];
		suffix?: TextFieldProps['suffix'];
		suffix_icon?: TextFieldProps['suffix_icon'];
	}

	let {
		value: field_value = $bindable(null),
		...text_field_props
	}: CurrencyField = $props();

	let focused = $state(false);
	let input_selection_direction = $state<HTMLInputElement['selectionDirection']>(null);
	let input_selection_start = $state<HTMLInputElement['selectionStart']>(null);
	let input_selection_end = $state<HTMLInputElement['selectionEnd']>(null);
	let input_value = $state('');

	$effect.pre(() => {
		const tracked_value = field_value;
		const tracked_focused = focused;

		untrack(() => {
			input_value = tracked_focused
				? format_as_number(tracked_value)
				: format_as_pretty_text(tracked_value);
		});
	});

	$effect.pre(() => {
		const value = input_value;

		untrack(() => {
			field_value = parse_as_number(value);
		});
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

		const amount = +(text.replace(/\s/g, '').replace(',', '.'));
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
	input_class={{
		'text-negative': field_value !== null && field_value < 0,
		'text-positive': field_value !== null && field_value > 0,
	}}
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
	on_clear={() => {
		input_value = '';
	}}
/>
