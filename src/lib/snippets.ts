import type { Component, Snippet } from 'svelte'

export function is_component(
	value: Snippet | Component
): value is Component {
	const prototype = Object.getOwnPropertyDescriptor(value, 'prototype')
	return prototype?.writable === true
}

export function is_snippet<T extends unknown[]>(
	value: Snippet<T> | Component
): value is Snippet<T> {
	return !is_component(value)
}
