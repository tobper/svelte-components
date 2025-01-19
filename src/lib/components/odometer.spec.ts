import { describe, expect, it } from 'vitest';
import { create_digits } from './odometer';

describe('odometer', () => {
	describe('create_digits', () => {
		it('returns digits counting up', () => {
			expect(create_digits('up', '3', '5')).toEqual('345');
		});

		it('returns digits counting up, looping around zero', () => {
			expect(create_digits('up', '9', '8')).toEqual('9012345678');
		});

		it('returns digits counting up, starting on non number character', () => {
			expect(create_digits('up', ' ', '3')).toEqual(' 123');
		});

		it('returns digits counting up, ending on non number character', () => {
			expect(create_digits('up', '8', ' ')).toEqual('89 ');
		});

		it('returns digits counting down', () => {
			expect(create_digits('down', '5', '3')).toEqual('543');
		});

		it('returns digits counting down, looping around zero', () => {
			expect(create_digits('down', '3', '5')).toEqual('321098765');
		});

		it('returns digits counting down, starting on non number character', () => {
			expect(create_digits('down', ' ', '5')).toEqual(' 98765');
		});

		it('returns digits counting down, ending on non number character', () => {
			expect(create_digits('down', '3', ' ')).toEqual('321 ');
		});

		it('returns current char when both previous and current has the same value', () => {
			expect(create_digits('down', 'a', 'a')).toEqual('a');
		});

		it('returns previous and current char when both are non numbers', () => {
			expect(create_digits('down', 'a', 'b')).toEqual('ab');
		});
	});
});
