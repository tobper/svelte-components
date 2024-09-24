import type { Style } from '$lib/index.js';

export const ssr = false;

export function load({ url }) {
	let theme = (url.searchParams.get('theme') ?? default_theme) as Style;

	if (!valid_theme(theme)) {
		console.warn(`"${theme}" is not a valid theme. Valid themes are ${humanize_list(themes)}.`);
		theme = default_theme;
	}

	return { theme };
}

function valid_theme(theme: string): theme is Style {
	return themes.includes(theme as Style);
}

const themes: Array<Style> = ['neomorphism', 'lines'];
const default_theme = themes[0];

function humanize_list(values: Array<unknown>) {
	const quoted = values.map(x => `"${x}"`);

	if (quoted.length === 1)
		return quoted[0];

	const first_items = quoted.slice(0, quoted.length - 1).join(', ');
	const last_item = quoted[quoted.length - 1];

	return `${first_items} and ${last_item}`;
}
