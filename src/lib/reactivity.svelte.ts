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

export function delayed_timer(
	duration: Duration | number = 'short'
): DelayTimer {
	const duration_time = typeof duration === 'number' ? duration : durations[duration];
	const timeout = timer(duration_time, () => value = true);
	let value = $state(false);

	return {
		get delayed() {
			return value;
		},
		reset() {
			timeout.stop();
			value = false;
		},
		start() {
			if (!timeout.running)
				timeout.start();
		}
	};
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
		stop,
		start,
		get expired() { return !timeout; },
		get running() { return !!timeout; }
	};

	function stop() {
		if (!timeout)
			return;

		clearTimeout(timeout);
		timeout = undefined;
	}

	function start() {
		if (timeout)
			clearTimeout(timeout);

		timeout = setTimeout(on_expired, time);
	}

	function on_expired() {
		timeout = undefined;
		action();
	}
}

export function async_value<T>(
	initial_value: T
) {
	const loading_timer = delayed_timer();
	let loaded = $state(true);
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
		reset,
		set
	};

	function reset() {
		active_promise = null;
		loading_timer.reset();
		loaded = false;
		loading = false;
		loading_error = null;
		value = initial_value;
	}

	async function set(new_value: T | Promise<T>) {
		if (!is_promise(new_value)) {
			loading_timer.reset();
			active_promise = null;
			loaded = true;
			loading = false;
			loading_error = null;
			value = new_value;

			return true;
		}

		loading_timer.start();
		active_promise = new_value;
		loading = true;
		loading_error = null;

		try {
			const resolved_value = await active_promise;

			// Ignore result if another promise has been set after this one
			if (active_promise === new_value)
				return set(resolved_value);
		}
		catch (reason) {
			// Ignore result if another promise has been set after this one
			if (active_promise === new_value) {
				loading_timer.reset();
				active_promise = null;
				loaded = false;
				loading = false;
				loading_error = `${reason}`;
				value = initial_value;
			}
		}

		return false;
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
 