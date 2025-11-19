export function mappedValue<T, U>(
	initial: T,
	get_mapped: (value: T) => U,
	set_mapped: (value: U, set: (value: T) => void) => void
) {
	let current = $state(initial);

	return {
		get current() {
			return current;
		},
		set current(new_value) {
			current = new_value
		},
		get mapped() {
			return get_mapped(current);
		},
		set mapped(new_value) {
			set_mapped(new_value, value => current = value)
		},
	}
}

export function mappedTextNumber(initial: number) {
	return mappedValue<number, string>(
		initial,
		num => num.toString(),
		(text, set) => {
			const num = parseInt(text);
			if (!isNaN(num))
				set(num)
		}
	)
}
