import { describe, expect, test } from 'vitest';
import { reactive_value } from './reactivity.svelte';

describe('reactive_value', () => {
	const primitives = [true, false, 42, 'Hello'];

	test.each(primitives)('returns value when a primitive', value => {
		expect(reactive_value(value)).toEqual(value);
	});

	test.each(primitives)('returns value when reactive', value => {
		expect(reactive_value({ current: value })).toEqual(value);
	});
});
