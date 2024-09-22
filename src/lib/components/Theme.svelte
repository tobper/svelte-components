<script lang="ts">
	import { set_root_style_property, toggle_root_class } from '$lib/css.js';
	import { device } from '../device.js';
	import '../styles/base.css';

	interface Theme {
		style: 'lines' | 'neomorphism';
		scheme?: 'dark' | 'light' | 'system';
		palette?: {
			primary?: string;
			secondary?: string;
			tertiary?: string;
			background_light?: string;
			background_dark?: string;
		}
	}

	let {
		style,
		palette = {},
		scheme = 'system'
	}: Theme = $props()

	$effect.pre(() => {
		if (style === 'lines')
			import('../styles/themes/lines.css');
		else if (style === 'neomorphism')
			import('../styles/themes/neomorphism.css');
	});

	$effect.pre(() => {
		const dark_mode = scheme === 'dark' || scheme == 'system' && device.prefers_dark_scheme;

		toggle_root_class('device-mobile', device.mobile);
		toggle_root_class('device-tablet', device.tablet);
		toggle_root_class('device-desktop', device.desktop);
		toggle_root_class('orientation-landscape', device.landscape);
		toggle_root_class('orientation-portrait', device.portrait);
		toggle_root_class('scheme-dark', dark_mode);
		toggle_root_class('scheme-light', !dark_mode);
		toggle_root_class('supports-hover', device.supports_hover);
		toggle_root_class('theme-lines', style === 'lines');
		toggle_root_class('theme-neomorphism', style === 'neomorphism');

		set_root_style_property('--palette__primary-base', palette.primary);
		set_root_style_property('--palette__secondary-base', palette.secondary);
		set_root_style_property('--palette__tertiary-base', palette.tertiary);
		set_root_style_property('--palette__background', dark_mode ? palette.background_dark : palette.background_light);
	});
</script>
