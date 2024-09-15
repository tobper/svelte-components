<script lang="ts">
	import { set_root_style_property, toggle_root_class } from '$lib/css.js';
	import { onMount } from 'svelte';
	import { device } from '../device.js';
	import { media_queries } from '../media.svelte.js';
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

	const media = media_queries({
		orientation_landscape: '(orientation: landscape)',
		orientation_portrait: '(orientation: portrait)',
		pointer_coarse: '(pointer: coarse)',
		pointer_fine: '(pointer: fine)',
		prefers_dark_scheme: '(prefers-color-scheme: dark)',
		supports_hover: '(hover: hover)',
	});

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

	onMount(() => {
		toggle_root_class('device-mobile', device.mobile);
		toggle_root_class('device-tablet', device.tablet);
	});

	$effect.pre(() => {
		const dark_mode = scheme === 'dark' || scheme == 'system' && media.prefers_dark_scheme;

		toggle_root_class('orientation-landscape', media.orientation_landscape);
		toggle_root_class('orientation-portrait', media.orientation_portrait);
		toggle_root_class('scheme-dark', dark_mode);
		toggle_root_class('scheme-light', !dark_mode);
		toggle_root_class('supports-hover', media.supports_hover);
		toggle_root_class('theme-lines', style === 'lines');
		toggle_root_class('theme-neomorphism', style === 'neomorphism');

		set_root_style_property('--palette__primary-base', palette.primary);
		set_root_style_property('--palette__secondary-base', palette.secondary);
		set_root_style_property('--palette__tertiary-base', palette.tertiary);
		set_root_style_property('--palette__background', dark_mode ? palette.background_dark : palette.background_light);
	});
</script>
