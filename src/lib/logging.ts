export interface Log {
	readonly enabled: boolean;
	enable(): void;
	disable(): void;
	debug(message: string, ...params: unknown[]): void;
	error(message: string, ...params: unknown[]): void;
	info(message: string, ...params: unknown[]): void;
	warning(message: string, ...params: unknown[]): void;
}

export interface LogAdapter {
	write(context: LogContext): void;
}

export interface LogContext {
	level: LogLevel;
	message: string;
	params: unknown[];
	source: string;
	timestamp: Date;
}

export type LogLevel = 'debug' | 'error' | 'info' | 'warning';

export class ConsoleLogAdapter implements LogAdapter {
	write({ level, message, params, source }: LogContext) {
		const args = [`[%s] ${message}`, source, ...params];

		switch (level) {
			case 'debug': console.debug(...args); break;
			case 'error': console.error(...args); break;
			case 'info': console.info(...args); break;
			case 'warning': console.warn(...args); break;
		}
	}
}

export function createLog(source: string): Log {
	const storage = createStorage(source, { on_change });
	let enabled = storage.enabled();

	return {
		get enabled() {
			return enabled;
		},

		enable() {
			enabled = true;
			storage.toggle(enabled);
		},
	
		disable() {
			enabled = false;
			storage.toggle(enabled);
		},

		debug(message, ...params) {
			write('debug', message, params);
		},
	
		error(message, ...params) {
			write('error', message, params);
		},
	
		info(message, ...params) {
			write('info', message, params);
		},
	
		warning(message, ...params) {
			write('warning', message, params);
		},
	};

	function on_change(new_value: boolean) {
		enabled = new_value;
	}

	function write(level: LogLevel, message: string, params: unknown[]) {
		if (!enabled)
			return;

		const timestamp = new Date();
		const context: LogContext = { level, message, params, source, timestamp };

		_adapter.write(context);
	}
}

export function setLogAdapter(logger: LogAdapter) {
	_adapter = logger;
}

let _adapter: LogAdapter = new ConsoleLogAdapter();

interface Storage {
	enabled(): boolean;
	toggle(enabled: boolean): void;
}

function createStorage(
	source: string,
	handlers: {
		on_change: (enabled: boolean) => void
	}
): Storage {
	if (!localStorage) {
		return {
			enabled() { return false; },
			toggle() { }
		}
	}

	const { on_change } = handlers;
	const key = `log_${source}`;

	window.addEventListener('storage', event => {
		if (event.key !== key)
			return;

		const enabled = event.newValue === '1';

		on_change(enabled);
	});

	return {
		enabled,
		toggle,
	}

	function enabled() {
		const value = localStorage.getItem(key);
		const enabled = value === '1';

		return enabled;
	}

	function toggle(enabled: boolean) {
		const new_value = enabled ? '1' : '0';
		const current_value = localStorage.getItem(key);

		// Avoid triggering storage event handlers if the value is the same
		if (new_value !== current_value)
			localStorage.setItem(key, new_value);
	}

}
