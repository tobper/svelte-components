import { describe, expect, it } from 'vitest';
import { parse_milliseconds, try_parse_milliseconds } from './time.js';

describe('parse_milliseconds', () => {
	it('throws if value can not be parsed', () => {
		expect(() => parse_milliseconds('')).toThrow();
		expect(() => parse_milliseconds('1')).toThrow();
		expect(() => parse_milliseconds('1m')).toThrow();
		expect(() => parse_milliseconds('foo')).toThrow();
	});
});

describe('try_parse_milliseconds', () => {
	it('returns number of milliseconds', () => {
		expect(try_parse_milliseconds('1s')).toEqual(1000);
		expect(try_parse_milliseconds('25s')).toEqual(25000);
		expect(try_parse_milliseconds('1ms')).toEqual(1);
		expect(try_parse_milliseconds('234ms')).toEqual(234);
	});

	it('returns null if value can not be parsed', () => {
		expect(try_parse_milliseconds('')).toBeNull();
		expect(try_parse_milliseconds('1')).toBeNull();
		expect(try_parse_milliseconds('1m')).toBeNull();
		expect(try_parse_milliseconds('foo')).toBeNull();
	});

	it('number may be explicitly positive or negative', () => {
		expect(try_parse_milliseconds('+1s')).toEqual(1000);
		expect(try_parse_milliseconds('-1s')).toEqual(-1000);
	});

	it('number may be fractional', () => {
		expect(try_parse_milliseconds('.1s')).toEqual(100);
		expect(try_parse_milliseconds('10.5s')).toEqual(10500);
	});
});
