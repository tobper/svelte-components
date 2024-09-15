export function match<T, K extends PropertyKey>(
	value: K,
	patterns: Record<K, T>
): T {
	return patterns[value]
}
