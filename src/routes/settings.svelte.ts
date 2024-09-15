let scheme = $state<'dark' | 'light' | 'system'>('system');

export const settings = {
	get scheme() { return scheme; },
	set scheme(value) { scheme = value; },
}
