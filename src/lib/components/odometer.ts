export type Direction = 'up' | 'down';

export function create_digits(
	direction: Direction,
	previous_char: string,
	current_char: string,
): string {
	if (current_char === previous_char)
		return current_char;

	const current_num = parseInt(current_char);
	const previous_num = parseInt(previous_char);

	if (isNaN(current_num) && isNaN(previous_num))
		return previous_char + current_char;

	const first_num = isNaN(previous_num) ? 0 : previous_num;
	const last_num = isNaN(current_num) ? 0 : current_num;

	// Calculate number of characters needed to transition
	// from previous_num to current_num
	const digits = (direction === 'up')
		// Going from 3 to 5 would generate '345'
		// Going from 8 to 2 would generate '89012'
		? Array.from(
			{ length: (last_num - first_num + 10) % 10 + 1 },
			(_, i) => `${(first_num + i) % 10}`
		)
		// Going from 3 to 5 would generate '321098765'
		// Going from 8 to 2 would generate '8765432'
		: Array.from(
			{ length: (first_num - last_num + 10) % 10 + 1 },
			(_, i) => `${(first_num - i + 10) % 10}`
		)

	if (isNaN(previous_num))
		digits[0] = previous_char;

	if (isNaN(current_num))
		digits[digits.length - 1] = current_char;

	return digits.join('');
}
