import type { Style } from '$lib';
import { redirect } from '@sveltejs/kit';

const default_theme: Style = 'neomorphism';

export function load() {
	redirect(307, default_theme);
}
