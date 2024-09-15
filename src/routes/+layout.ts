import type { Theme } from '$lib/index.js';
import type { ComponentProps } from 'svelte';

type ThemeStyle = ComponentProps<typeof Theme>['style'];

export function load({ url }) {
	let theme = url.searchParams.get('theme') as ThemeStyle;

	if (!valid_theme(theme)) {
		console.warn(`"${theme}" is not a valid theme. Valid themes are ${humanize_list(themes)}.`);
		theme = default_theme;
	}

	return { theme };
}

function valid_theme(theme: string): theme is ThemeStyle {
	return themes.includes(theme as ThemeStyle);
}

const themes: Array<ThemeStyle> = ['neomorphism', 'lines'];
const default_theme = themes[0];

function humanize_list(values: Array<unknown>) {
	const quoted = values.map(x => `"${x}"`);

	if (quoted.length === 1)
		return quoted[0];

	const first_items = quoted.slice(0, quoted.length - 1).join(', ');
	const last_item = quoted[quoted.length - 1];

	return `${first_items} and ${last_item}`;
}
