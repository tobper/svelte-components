import { describe, expect, it } from 'vitest';
import { ContextValue } from './ContextValue.svelte.js';

describe('ContextValue', () => {
	it('returns the latest set value as current', () => {
		const foo = new ContextValue();
		foo.set('a');
		foo.set('b');

		expect(foo.current).toEqual('b');
	});

	it('removes specified value using callback', () => {
		const foo = new ContextValue();
		foo.set('a');

		const remove = foo.set('b');
		remove();

		expect(foo.current).toEqual('a');
	});
});
