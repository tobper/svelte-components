import { untrack } from 'svelte';
import { seconds } from './time.js';

export const durations = {
	short: seconds(0.75),
	long: seconds(5),
} as const;

export type Duration = keyof typeof durations;

export interface DelayTimer {
	/** Indicates whether the timer was started and has expired. */
	readonly delayed: boolean;
	/** Stops the timer and sets delayed to false. */
	reset(): void;
	/** Starts the timer, but does not reset it to start if it is already running. */
	start(): void;
}

export function delayed_timer(
	duration: Duration | number = 'short',
	on_delayed?: () => void
): DelayTimer {
	const timeout = timer(get_duration(duration), () => {
		delayed = true;
		on_delayed?.();
	});

	let delayed = $state(false);

	return {
		get delayed() { return delayed; },

		reset() {
			timeout.stop();
			delayed = false;
		},

		start() {
			if (!timeout.running)
				timeout.start();
		}
	};
}

export interface Timer {
	/** Indicates whether a timer has expired. */
	readonly expired: boolean;
	/** Indicates whether a timer is currently running. */
	readonly running: boolean;
	/** Starts the timer, resets it to start if it is already running. */
	start(): void;
	/** Stops the timer, if it is running. */
	stop(): void;
}

/**
 * Creates a timeout in a stopped state
 *
 * @param time The time to wait before it expires
 * @param on_expired The action to call when the timer expires
 */
export function timer(
	duration: Duration | number,
	on_expired: () => void
): Timer {
	let timeout = $state<ReturnType<typeof setTimeout>>();

	return {
		get expired() { return !timeout; },
		get running() { return !!timeout; },

		stop() {
			if (!timeout)
				return;
	
			clearTimeout(timeout);
			timeout = undefined;
		},

		start() {
			if (timeout)
				clearTimeout(timeout);

			timeout = setTimeout(timeout_handler, get_duration(duration));
		},
	};

	function timeout_handler() {
		timeout = undefined;
		on_expired();
	}
}

function get_duration(duration: Duration | number): number {
	return typeof duration === 'number'
		? duration
		: durations[duration];
}

export interface AsyncValueMap<K, T> {
	get(key: K): AsyncReadonlyValue<T>;
	has(key: K): boolean;
	set(key: K, new_value: T | Promise<T>): void;
	reset(): void;
	update(updater: (key: K) => (current_value: T) => T): void;
}

export interface AsyncValueMapOptions<K, T> {
	on_error?: (error: Error, key: K) => void;
	on_update?: (value: T, key: K) => T;
	on_updated?: (value: T, key: K) => void,
}

export function async_value_map<K, T>(
	initial_value: T,
	// loader: (key: K) => Promise<T>,
	options?: AsyncValueMapOptions<K, T>
): AsyncValueMap<K, T> {
	const values_map = new Map<K, ReturnType<typeof async_value<T>>>();
	const { on_error, on_update, on_updated } = options ?? {};

	return {
		get(key: K): AsyncReadonlyValue<T> {
			const value = values_map.get(key);
			if (value)
				return value.as_readonly();

			console.warn(`Value have not been loaded for ${key}`);

			return {
				current: initial_value,
				delayed: false,
				loading: false,
				loading_error: null,
				loaded: false,
			}
		},

		// async load(key: K) {
		// 	if (values_map.has(key))
		// 		return;

		// 	const values = async_value(initial_value, options);

		// 	values_map.set(key, values);

		// 	await values.set(loader(key));
		// },

		has(key: K) {
			return values_map.has(key);
		},

		set(key: K, new_value: T | Promise<T>) {
			let values = values_map.get(key);

			if (!values) {
				values = async_value(initial_value, {
					on_error(error) {
						on_error?.(error, key)
					},
					on_update(value) {
						return on_update
							? on_update(value, key)
							: value
					},
					on_updated(value) {
						on_updated?.(value, key)
					},
				});
				values_map.set(key, values);
			}

			return values.set(new_value);
		},

		reset() {
			values_map.forEach(value => value.reset());
			values_map.clear();
		},

		update(updater: (key: K) => (current_value: T) => T) {
			values_map.forEach((value, key) =>
				value.update(updater(key))
			);
		}
	};
}

export interface AsyncValue<T> {
	readonly delayed: boolean;
	readonly loaded: boolean;
	readonly loading: boolean;
	readonly loading_error: Error | null;
	readonly current: T;
	as_readonly(): AsyncReadonlyValue<T>,
	reset(): void,
	set(new_value: T | Promise<T>): void,
	update(updater: (current_value: T) => T | Promise<T>): void
}

export interface AsyncValueOptions<T> {
	on_error?: (value: Error) => void,
	on_update?: (value: T) => T,
	on_updated?: (value: T) => void,
}

export interface AsyncReadonlyValue<T> {
	readonly delayed: boolean;
	readonly loaded: boolean;
	readonly loading: boolean;
	readonly loading_error: Error | null;
	readonly current: T;
}

type AsyncDerivedSource =
	| AsyncReadonlyValue<unknown>
	| [AsyncReadonlyValue<unknown>, ...Array<AsyncReadonlyValue<unknown>>]
	| Array<AsyncReadonlyValue<unknown>>;

type AsyncDerivedSourceValues<T> =
  T extends AsyncReadonlyValue<infer U>
  ? U
  : { [K in keyof T]: T[K] extends AsyncReadonlyValue<infer U> ? U : never }

export function async_value<T>(
	initial_value: T,
	options?: AsyncValueOptions<T>
): AsyncValue<T> {
	const { on_update, on_updated } = options ?? {};
	const loading_timer = delayed_timer();
	let loaded = $state(false);
	let loading = $state(false);
	let loading_error = $state<Error | null>(null);
	let current = $state<T>(initial_value);
	let active_promise: Promise<T> | null = null;

	return {
		get delayed() { return loading_timer.delayed; },
		get loaded() { return loaded; },
		get loading() { return loading; },
		get loading_error() { return loading_error; },
		get current() { return current; },
		as_readonly,
		reset,
		set,
		update
	};

	function as_readonly() {
		return {
			get delayed() { return loading_timer.delayed; },
			get loaded() { return loaded; },
			get loading() { return loading; },
			get loading_error() { return loading_error; },
			get current() { return current; },
		};
	}

	function reset() {
		untrack(() => {
			loading_timer.reset();
			active_promise = null;
			loaded = false;
			loading = false;
			loading_error = null;
			current = initial_value;
		});
	}

	function set(new_value: T | Promise<T>) {
		// Ensure we don't end up in infinite loop when running in effects
		untrack(() => {
			if (is_promise(new_value)) {
				loading_timer.start();
				active_promise = new_value;
				loading = true;
				loading_error = null;
	
				active_promise
					.then(resolved_value => {
						// Ignore result if another promise has been set after this one
						if (active_promise === new_value)
							set(resolved_value);
					})
					.catch(error => {
						// Ignore result if another promise has been set after this one
						if (active_promise === new_value) {
							reset();
							loading_error = error instanceof Error ? error : new Error(`${error}`);
							options?.on_error?.(error);
						}
					});
			}
			else {
				loading_timer.reset();
				active_promise = null;
				loaded = true;
				loading = false;
				loading_error = null;
				current = on_update
					? on_update(new_value)
					: new_value;

				if (on_updated)
					on_updated(new_value);
			}
		});
	}

	function update(updater: (current_value: T) => T | Promise<T>) {
		set(updater(current));
	}
}

export function async_derived<S extends AsyncDerivedSource, T>(
	source: S,
	mapper: (values: AsyncDerivedSourceValues<S>) => T
): AsyncReadonlyValue<T> {
	if (Array.isArray(source)) {
		const delayed = $derived(source.some(s => s.delayed));
		const loaded = $derived(source.every(s => s.loaded));
		const loading = $derived(source.some(s => s.loading));
		const loading_error = $derived(source.find(s => !!s.loading_error)?.loading_error ?? null);
		const mapped_value = $derived(
			mapper(
				source.map(s => s.current) as AsyncDerivedSourceValues<S>
			)
		);

		return {
			get delayed() { return delayed; },
			get loaded() { return loaded; },
			get loading() { return loading; },
			get loading_error() { return loading_error; },
			get current() { return mapped_value; },
		};
	}

	const source_value = source.current as AsyncDerivedSourceValues<S>;
	const mapped_value = $derived(mapper(source_value));

	return {
		get delayed() { return source.delayed; },
		get loaded() { return source.loaded; },
		get loading() { return source.loading; },
		get loading_error() { return source.loading_error; },
		get current() { return mapped_value; },
	}
}

export function is_promise(value: unknown): value is Promise<unknown> {
	return (
		!!value &&
		(typeof value === 'object' || typeof value === 'function') &&
		'then' in value &&
		typeof value.then === 'function'
	)
}

export type ReactiveBoolean = ReactiveValue<boolean>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveString = ReactiveValue<string>;
export type ReactiveValue<T> = T | { current: T };

export function reactive_value<T extends string | number | boolean>(value: ReactiveValue<T>): T {
	return typeof value === 'object'
		? value.current
		: value;
}
