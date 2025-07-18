export function unique_id() {
	return Math
		.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
}
