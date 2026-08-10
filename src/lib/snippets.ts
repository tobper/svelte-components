import type { Component, Snippet } from 'svelte';

export function is_component(
	value: Snippet | Component
): value is Component {
	return (
		typeof value === 'function' &&
		value.name !== 'snippet'
	);
}

export function is_snippet<T extends unknown[]>(
	value: Snippet<T> | unknown
): value is Snippet<T> {
	return (
		typeof value === 'function' &&
		value.name === 'snippet'
	);
}
