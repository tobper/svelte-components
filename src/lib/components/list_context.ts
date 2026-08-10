import { getContext, setContext } from 'svelte';

export const list_context_key = Symbol('List');

export interface ListContext {
	readonly focusable: boolean;
}

export function get_list_context(): ListContext | undefined {
	return getContext<ListContext>(list_context_key);
}

export function set_list_context(state: ListContext) {
	return setContext(list_context_key, state);
}
