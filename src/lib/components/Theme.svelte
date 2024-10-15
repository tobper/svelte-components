<script lang="ts" module>
	export type Scheme = 'dark' | 'light' | 'system';
	export type Style = 'lines' | 'neomorphism';

	export interface ThemeContext {
		scheme: Scheme;
		style: Style;
	}

	// const context_key = Symbol('Theme');
	const context = $state<ThemeContext>({
		scheme: 'system',
		style: 'neomorphism',
	})

	export function get_theme() {
		return context;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { set_root_style, toggle_root_class } from '../css.js';
	import { device } from '../device.js';
	import { media_queries } from '../media.svelte.js';
	import '../styles/base.css';

	interface Theme {
		style?: Style;
		scheme?: Scheme;
		palette?: {
			primary?: string;
			secondary?: string;
			tertiary?: string;
			background_light?: string;
			background_dark?: string;
		}
	}

	const context = get_theme();

	let {
		style = context.style,
		palette = {},
		scheme = context.scheme
	}: Theme = $props()

	const media = media_queries({
		prefers_dark_scheme: '(prefers-color-scheme: dark)',
		supports_hover: '(hover: hover)',
	}, onDestroy);

	$effect.pre(() => {
		if (style === 'lines')
			import('../styles/themes/lines.css');
		else if (style === 'neomorphism')
			import('../styles/themes/neomorphism.css');
		
		context.scheme = scheme;
		context.style = style;
	});

	$effect.pre(() => {
		const dark_mode = scheme === 'dark' || scheme == 'system' && media.prefers_dark_scheme;

		toggle_root_class('device-mobile', device.mobile);
		toggle_root_class('device-tablet', device.tablet);
		toggle_root_class('device-desktop', device.desktop);
		toggle_root_class('orientation-landscape', device.landscape);
		toggle_root_class('orientation-portrait', device.portrait);
		toggle_root_class('scheme-dark', dark_mode);
		toggle_root_class('scheme-light', !dark_mode);
		toggle_root_class('supports-hover', media.supports_hover);
		toggle_root_class('theme-lines', style === 'lines');
		toggle_root_class('theme-neomorphism', style === 'neomorphism');

		set_root_style('--palette__primary-base', palette.primary);
		set_root_style('--palette__secondary-base', palette.secondary);
		set_root_style('--palette__tertiary-base', palette.tertiary);
		set_root_style('--palette__background', dark_mode ? palette.background_dark : palette.background_light);
	});
</script>
