import { UAParser } from 'ua-parser-js';
import { media_queries } from './media.svelte.js';

const ua_parser = new UAParser();
const ua_device = ua_parser.getDevice()
const ua_engine = ua_parser.getEngine()

const media = media_queries({
	landscape: '(orientation: landscape)',
	portrait: '(orientation: portrait)',
	pointer_coarse: '(pointer: coarse)',
	pointer_fine: '(pointer: fine)',
});

const mobile = ua_device.type === 'mobile';
const tablet = ua_device.type === 'tablet';
const desktop = !mobile && !tablet;

export const device = {
	mobile,
	tablet,
	desktop,

	get engine() { return `${ua_engine.name} ${ua_engine.version}`; },

	/* Orientation */
	get landscape() { return media.landscape },
	get portrait() { return media.portrait },

	/* Pointer device */
	get mouse() { return media.pointer_fine },
	get touch() { return media.pointer_coarse },
};
