export function input_value_proxy<T>(
	get_current_value: () => T | null,
	update: (new_value: T | null) => void,
	parse: (text: string) => T | null,
	format: (value: T) => string,
	equals: (value_1: T, value_2: T) => boolean
) {
	let previous_value: T | null = null;
	let previous_text = '';

	return {
		get value() {
			const current_value = get_current_value();
			const same_value =
				(current_value === null && previous_value === null) ||
				(current_value !== null && previous_value !== null && equals(current_value, previous_value));

			if (!same_value) {
				previous_text = current_value !== null ? format(current_value) : '';
				previous_value = current_value;
			}

			return previous_text;
		},
		set value(text) {
			previous_text = text;
			previous_value = parse(text);

			update(previous_value);
		}
	}	
}
