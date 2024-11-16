export function seconds(seconds: number) {
	return seconds * 1000;
}

export function minutes(minutes: number) {
	return minutes * 60000;
}

export function hours(hours: number) {
	return hours * 3600000;
}

export function days(days: number) {
	return days * 86400000;
}

export function parse_milliseconds(duration: string) {
	const value = try_parse_milliseconds(duration);
	if (value === null)
		throw new Error(`Invalid duration: '${duration}'`);

	return value;
}

export function try_parse_milliseconds(duration: string): number | null {
	if (!duration)
		return null;

	const match = duration.match(/^([+-]?)([\d.]+)(ms|s)$/);
	if (!match)
		return null;

	const negative = match[1] === '-';
	const amount = +match[2] * (negative ? -1 : 1);
	const unit = match[3];

	switch (unit) {
		case 'ms': return amount;
		case 's': return seconds(amount);
	}

	return null
}
