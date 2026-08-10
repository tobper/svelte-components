import type { Scheme } from '$lib';
import { getContext, setContext } from 'svelte';

const context_key = Symbol('Scheme')

interface SchemeContext {
	current: Scheme
}

export function create_scheme_context() {
	const context = $state<SchemeContext>({
		current: 'system'
	})

	setContext<SchemeContext>(context_key, context)

	return context
}

export function get_scheme() {
	return getContext<SchemeContext>(context_key)
}
