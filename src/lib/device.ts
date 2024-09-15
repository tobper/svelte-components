import { UAParser } from 'ua-parser-js';

const ua_parser = new UAParser();
const ua_device = ua_parser.getDevice()

export const device = {
	mobile: ua_device.type === 'mobile',
	tablet: ua_device.type === 'tablet',
};
