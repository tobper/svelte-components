import { untrack } from 'svelte';
import { seconds } from './time.js';

const durations = {
	short: seconds(0.75),
	long: seconds(5),
} as const;

type Duration = keyof typeof durations;

export interface DelayTimer {
	/** Indicates whether the timer was started and has expired. */
	readonly delayed: boolean;
	/** Stops the timer and sets delayed to false. */
	reset(): void;
	/** Starts the timer, but does not reset it to start if it is already running. */
	start(): void;
}

export function delayed_timer(
	duration: Duration | number = 'short'
): DelayTimer {
	const duration_time = typeof duration === 'number' ? duration : durations[duration];
	const timeout = timer(duration_time, () => delayed = true);
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
 * @param action The action to call when the timer expires
 */
export function timer(
	time: number,
	action: () => void
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
	
			timeout = setTimeout(on_expired, time);
		},
	};

	function on_expired() {
		timeout = undefined;
		action();
	}
}

export function async_value_map<K, T>(
	initial_value: T,
	// loader: (key: K) => Promise<T>,
	options?: {
		on_update?: (value: T) => T
	}
) {
	const values_map = new Map<K, ReturnType<typeof async_value<T>>>();

	return {
		get(key: K): AsyncReadonlyValue<T> {
			const value = values_map.get(key);
			if (value)
				return value.as_readonly();

			console.warn(`Value have not been loaded for ${key}`);

			return {
				value: initial_value,
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
				values = async_value(initial_value, options);
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
	readonly loading_error: string | null;
	readonly value: T;
	as_readonly(): AsyncReadonlyValue<T>,
	reset(): void,
	set(new_value: T | Promise<T>): void,
	update(updater: (current_value: T) => T): void
}

export interface AsyncReadonlyValue<T> {
	readonly delayed: boolean;
	readonly loaded: boolean;
	readonly loading: boolean;
	readonly loading_error: string | null;
	readonly value: T;
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
	options?: {
		on_update?: (value: T) => T,
		on_updated?: (value: T) => void,
	}
): AsyncValue<T> {
	const { on_update, on_updated } = options ?? {};
	const loading_timer = delayed_timer();
	let loaded = $state(false);
	let loading = $state(false);
	let loading_error = $state<string | null>(null);
	let value = $state<T>(initial_value);
	let active_promise: Promise<T> | null = null;

	return {
		get delayed() { return loading_timer.delayed; },
		get loaded() { return loaded; },
		get loading() { return loading; },
		get loading_error() { return loading_error; },
		get value() { return value; },
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
			get value() { return value; },
		};
	}

	function reset() {
		loading_timer.reset();
		active_promise = null;
		loaded = false;
		loading = false;
		loading_error = null;
		value = initial_value;
	}

	function set(new_value: T | Promise<T>) {
		// Ensure we don't end up in infinite llo when running in effects
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
					.catch(reason => {
						// Ignore result if another promise has been set after this one
						if (active_promise === new_value) {
							reset();
							loading_error = `${reason}`;
						}
					});
			}
			else {
				loading_timer.reset();
				active_promise = null;
				loaded = true;
				loading = false;
				loading_error = null;
				value = on_update
					? on_update(new_value)
					: new_value;

				if (on_updated)
					on_updated(new_value);
			}
		});
	}

	function update(updater: (current_value: T) => T) {
		set(updater(value));
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
				source.map(s => s.value) as AsyncDerivedSourceValues<S>
			)
		);

		return {
			get delayed() { return delayed; },
			get loaded() { return loaded; },
			get loading() { return loading; },
			get loading_error() { return loading_error; },
			get value() { return mapped_value; },
		};
	}

	const source_value = source.value as AsyncDerivedSourceValues<S>;
	const mapped_value = $derived(mapper(source_value));

	return {
		get delayed() { return source.delayed; },
		get loaded() { return source.loaded; },
		get loading() { return source.loading; },
		get loading_error() { return source.loading_error; },
		get value() { return mapped_value; },
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
 