import { on } from './html';

export function getModifierKeys() {
	let alt = $state.raw(false);
	let control = $state.raw(false);
	let meta = $state.raw(false);
	let shift = $state.raw(false);

	$effect(() =>
		on(window, {
			keydown: ({ key }) => {
				alt ||= key === 'Alt';
				control ||= key === 'Control';
				meta ||= key === 'Meta';
				shift ||= key === 'Shift';
			},
			keyup: ({ key }) => {
				alt &&= key !== 'Alt';
				control &&= key !== 'Control';
				meta &&= key !== 'Meta';
				shift &&= key !== 'Shift';
			},
		}),
	);

	return {
		get alt() { return alt; },
		get control() { return control; },
		get meta() { return meta; },
		get shift() { return shift; },
	};
}
