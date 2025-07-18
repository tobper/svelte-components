import { get_element } from '../html.js';
import { unique_id } from '../unique_id.js';

export interface MenuOptions {
	anchor?: HTMLElement | string;
	trigger?: HTMLElement | string;
	on_close?: () => void;
	on_open?: () => void;
}

export function menu(
	dialog: HTMLDialogElement,
	options: MenuOptions
) {
	const anchor_name = `--${unique_id()}`;
	const { on_close, on_open } = options;
	let { anchor, trigger } = options;

	if (typeof trigger === 'string')
		trigger = get_element(`#${trigger}`);

	if (!anchor)
		anchor = trigger;

	if (typeof anchor === 'string')
		anchor = get_element(`#${anchor}`);

	if (!anchor)
		throw new Error('No valid anchor or trigger specified.')

	dialog.classList.add('menu');
	dialog.style.setProperty('position-anchor', anchor_name);
	dialog.addEventListener('click', on_dialog_click);
	dialog.addEventListener('close', on_dialog_close);

	anchor.style.setProperty('anchor-name', anchor_name);
	trigger?.addEventListener('click', on_trigger_click);

	return {
		destroy() {
			dialog.removeEventListener('click', on_dialog_click);
			dialog.removeEventListener('close', on_dialog_close);
			trigger?.removeEventListener('click', on_trigger_click);
		}
	}

	function on_dialog_click({ target }: Event) {
		// Click event on the dialog itself means that the backdrop is clicked,
		// otherwise the target would be a child element.
		const clicked_backdrop = target === dialog;
		if (clicked_backdrop)
			dialog.close();
	}

	function on_dialog_close() {
		on_close?.();
	}

	function on_trigger_click() {
		on_open?.();
		dialog.showModal();
	}
}
