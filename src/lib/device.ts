import { UAParser } from 'ua-parser-js';
import { media_queries } from './media.svelte.js';

const ua_parser = new UAParser();
const ua_device = ua_parser.getDevice()

const media = media_queries({
	landscape: '(orientation: landscape)',
	portrait: '(orientation: portrait)',
	pointer_coarse: '(pointer: coarse)',
	pointer_fine: '(pointer: fine)',
	prefers_dark_scheme: '(prefers-color-scheme: dark)',
	supports_hover: '(hover: hover)',
});

const mobile = ua_device.type === 'mobile';
const tablet = ua_device.type === 'tablet';
const desktop = !mobile && !tablet;

export const device = {
	mobile,
	tablet,
	desktop,

	/* Orientation */
	get landscape() { return media.landscape },
	get portrait() { return media.portrait },

	/* Pointer device */
	get mouse() { return media.pointer_fine },
	get touch() { return media.pointer_coarse },

	/* Styling */
	get prefers_dark_scheme() { return media.prefers_dark_scheme },
	get supports_hover() { return media.supports_hover },
};
