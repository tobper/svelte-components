import { UAParser } from 'ua-parser-js';
import { media_queries } from './media.svelte.js';

const ua_parser = new UAParser();
const ua_browser = ua_parser.getBrowser();
const ua_device = ua_parser.getDevice();
const ua_engine = ua_parser.getEngine();

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
	get browser_name() { return ua_browser.name },
	get browser_version() { return ua_browser.version },

	get mobile() { return mobile },
	get tablet() { return tablet },
	get desktop() { return desktop },

	get engine() { return `${ua_engine.name} ${ua_engine.version}`; },

	/* Orientation */
	get landscape() { return media.landscape },
	get portrait() { return media.portrait },

	/* Pointer device */
	get mouse() { return media.pointer_fine },
	get touch() { return media.pointer_coarse },
};
