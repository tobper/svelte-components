import { describe, expect, it } from 'vitest';
import { create_normalized_lookup } from './normalization.js';

describe('create_normalized_lookup', () => {
	describe('find', () => {
		it('returns undefined when query is empty', () => {
			const source = ['Bob', 'Jane', 'John'];
			const { find } = create_normalized_lookup(source);

			expect(find('')).toEqual(null);
		});

		it('returns undefined when no match is found', () => {
			const source = ['Bob', 'Jane', 'John'];
			const { find } = create_normalized_lookup(source);

			expect(find('x')).toEqual(null);
		});

		it('returns first value containing query when multiple matches has the same length', () => {
			const source = ['Bob', 'Jane', 'Job'];
			const { find } = create_normalized_lookup(source);

			expect(find('o')).toEqual('Bob');
		});

		it('returns value starting with query when multiple values match', () => {
			const source = ['Rob', 'Bobby', 'John'];
			const { find } = create_normalized_lookup(source);

			expect(find('b')).toEqual('Bobby');
		});

		it('returns value containing all query fragments', () => {
			const source = ['John Smith', 'Jane Smith', 'Jane Doe', 'Robert Jane'];
			const { find } = create_normalized_lookup(source);

			expect(find('ja oe')).toEqual('Jane Doe');
		});

		it('returns shortest value when multiple values match', () => {
			const source = ['Robert', 'Rob', 'John'];
			const { find } = create_normalized_lookup(source);

			expect(find('b')).toEqual('Rob');
		});

		it('returns values containing query regardless of diacritics', () => {
			const source = ['John Smith', 'Bôb à la Éclair'];
			const { find } = create_normalized_lookup(source);

			expect(find('ecl')).toEqual('Bôb à la Éclair');
		});
	});

	describe('find_all', () => {
		it('returns all values when query is empty', () => {
			const source = ['Bob', 'Jane', 'John'];
			const { find_all } = create_normalized_lookup(source);

			expect(find_all('')).toEqual(source);
		});

		it('returns empty array when no match is found', () => {
			const source = ['Bob', 'Jane', 'John'];
			const { find_all } = create_normalized_lookup(source);

			expect(find_all('x')).toEqual([]);
		});

		it('returns all values containing query', () => {
			const source = ['Bob', 'Jane', 'John'];
			const { find_all } = create_normalized_lookup(source);

			expect(find_all('o')).toEqual(['Bob', 'John']);
		});

		it('returns values containing all query fragments', () => {
			const source = ['John Smith', 'Jane Smith', 'Jane Doe', 'Robert Jane'];
			const { find_all } = create_normalized_lookup(source);

			expect(find_all('ja oe')).toEqual(['Jane Doe']);
		});

		it('returns values containing query regardless of diacritics', () => {
			const source = ['John Smith', 'Jane Smith', 'Jane Doe', 'Robert Jane', 'Bôb à la Éclair'];
			const { find_all } = create_normalized_lookup(source);

			expect(find_all('bob')).toEqual(['Bôb à la Éclair']);
		});

		it('returns sorted result where matches starting with query is prioritized', () => {
			const source = ['Apple', 'Apricot', 'Banana', 'Cherry', 'Grape', 'Grapefruit', 'Kiwi', 'Mango', 'Orange', 'Pineapple'];
			const { find_all } = create_normalized_lookup(source);

			expect(find_all('o')).toEqual(['Orange', 'Mango', 'Apricot']);
		});
	});
});
