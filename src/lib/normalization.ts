/**
 * Creates predicate functions accepting a string argument that will be compared against predefined values.
 *
 * @param values
 * The values to compare against with the value passed to the predicates
 *
 * @param comparison_projection
 * A projection to apply to all values before comparison is performed
 *
 * @returns
 * All values matching the value passed in the predicate
 *
 * @example
 * const find_person = create_normalized_lookup(['John Smith', 'Jane Smith', 'Jane Doe', 'Bob à la Éclair']);
 * const johns = find_person('john'); // returns ['John Smith']
 * const janes = find_person('jane'); // returns ['Jane Smith', 'Jane Doe']
 * const janeSmiths = find_person('ja smi'); // returns ['Jane Smith']
 * const bobs = find_person('ecl'); // returns ['Bob à la Éclair']
 */
export function create_normalized_lookup<T>(
	values: Iterable<T>,
	comparison_projection: (value: T) => unknown = value => value
) {
	const normalized_values = Array.from(values, value =>
		[normalize(comparison_projection(value)), value] as [string, T]
	);

	return { find, find_all };

	function find(query: unknown) {
		const matcher = get_matcher(query);
		if (!matcher)
			return null;

		let match: ({ value: T; normalized_value: string; rank: number; }) | undefined = undefined;

		for (const [normalized_value, value] of normalized_values) {
			const { matches, rank } = matcher(normalized_value);
			if (!matches)
				continue;

			if (match && compare(match, { rank, normalized_value }) <= 0)
				continue;

			match = { value, normalized_value, rank };
		}

		return match ? match.value : null;
	}

	function find_all(query: unknown) {
		const matcher = get_matcher(query);
		if (!matcher)
			return values;

		const matched_values: { value: T; normalized_value: string; rank: number; }[] = [];

		for (const [normalized_value, value] of normalized_values) {
			const { matches, rank } = matcher(normalized_value);
			if (!matches)
				continue;

			matched_values.push({ value, normalized_value, rank });
		}

		return matched_values
			.sort(compare)
			.map(({ value }) => value);
	}

	function compare(
		a: { rank: number; normalized_value: string; },
		b: { rank: number; normalized_value: string; }
	): number {
		if (a.rank !== b.rank)
			return a.rank - b.rank;

		if (a.normalized_value.length !== b.normalized_value.length)
			return a.normalized_value.length - b.normalized_value.length;

		if (a.normalized_value < b.normalized_value)
			return -1;

		if (a.normalized_value > b.normalized_value)
			return 1;

		return 0;
	}

	function get_matcher(query: unknown): Matcher | null {
		const normalized_query = normalize(query);
		if (!normalized_query)
			return null;

		const query_fragments = normalized_query.split(' ');

		const starts_with_query =
			(item_value: string) => item_value.startsWith(normalized_query);

		const contains_query =
			(item_value: string) => query_fragments.every(query_fragment => item_value.indexOf(query_fragment) !== -1);

		return function matches(item_value: string) {
			const rank =
				starts_with_query(item_value) ? 1 :
					contains_query(item_value) ? 2 :
						undefined;

			return rank
				? { matches: true, rank }
				: { matches: false, rank: undefined };
		};
	}
}

type Matcher = (query: string) =>
	| { matches: true; rank: number; }
	| { matches: false; rank: undefined; };

/**
 * Normalize a value by trimming and removing diacritics and unnecessary whitespace.
 *
 * @param value
 * The value to normalize
 *
 * @returns
 * A new string with the normalized value
 */
export function normalize(value: unknown): string {
	if (value == null)
		return '';

	return flatten(value)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.replace(/\W+/g, ' ') // Remove unnecessary whitespace
		.trim();

	function flatten(value: unknown, visited = new Set()): string {
		if (value == null || visited.has(value))
			return '';

		visited.add(value);

		if (typeof value !== 'object')
			return value.toString();

		return Object
			.values(value)
			.map(childValue => flatten(childValue, visited))
			.join(' ');
	}
}
