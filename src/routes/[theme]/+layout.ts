import type { Style } from '$lib/index.js';
import { redirect } from '@sveltejs/kit';

export const ssr = false;
const available_themes: Array<Style> = ['lines', 'neomorphism'];

export function load({ params }) {
	const theme = params.theme as Style

	if (!available_themes.includes(theme)) {
		console.warn(`"${theme}" is not a valid theme. Valid themes are ${humanize_list(available_themes)}.`);
		redirect(307, '/');
	}

	return { theme };
}

function humanize_list(values: Array<unknown>) {
	const quoted = values.map(x => `"${x}"`);

	if (quoted.length === 1)
		return quoted[0];

	const first_items = quoted.slice(0, quoted.length - 1).join(', ');
	const last_item = quoted[quoted.length - 1];

	return `${first_items} and ${last_item}`;
}
