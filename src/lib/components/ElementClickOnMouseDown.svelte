<script lang="ts">
	import { goto } from '$app/navigation';

	// Touch event is not working
	// First pointer down is triggered correct, but if that click triggers a dialog close
	// for instance, the underlying element is also triggered on the same click, possibly
	// causing a new dialog to open up.
	const allowed_pointer_types = [/*'touch', */'mouse'];

	function get_handler(event: MouseEvent | TouchEvent) {
		// Only handle clicks using mouse
		const allowed_click =
			// event instanceof TouchEvent ||
			event instanceof PointerEvent && allowed_pointer_types.includes(event.pointerType);
		if (!allowed_click)
			return;

		// Do not handle when modifier keys are used
		const modifier_key_pressed =  event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
		if (modifier_key_pressed)
			return;

		// Ensure html element is clicked
		const { target } = event;
		if (!(target instanceof HTMLElement))
			return;

		const link = target.closest('a');
		if (link) {
			const data = (key: string) =>
				link.dataset[key] !== undefined &&
				link.dataset[key] !== 'false';
			const external_link = link.rel === 'external';
			const external_host = link.host !== window.location.host;
			const force_reload = data('sveltekitReload');

			// Only handle correct links
			if (external_link || external_host || force_reload)
				return;

			return () => {
				const
					// cspell:ignore sveltekitKeepfocus, sveltekitReplacestate
					keepFocus = data('sveltekitKeepfocus'),
					noScroll = data('sveltekitNoscroll'),
					replaceState = data('sveltekitReplacestate');

				goto(link.href, { keepFocus, noScroll, replaceState });
			};
		}

		const element = target.closest('button, label:has(input[type=radio], input[type=checkbox])');
		if (element instanceof HTMLElement) {
			return () => {
				element.click();
			};
		}

		const dialog = target.closest('dialog');
		if (dialog) {
			return () => {
				target.click();
			};
		}
	}

	function on_pointer_down(event: PointerEvent) {
		// Only handle clicks using primary mouse button
		const primary_button_click = event.buttons === 1;
		if (!primary_button_click)
			return;

		const handler = get_handler(event);
		if (handler)
			handler();
	}

	function on_click(event: MouseEvent | TouchEvent) {
		// Touch event is not working
		if (event instanceof TouchEvent)
			return;

		// Click handler is only triggered for primary mouse button so no need to check that here

		const handler = get_handler(event);
		if (handler) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
		}
	}
</script>

<svelte:body
	onclickcapture={on_click}
	onpointerdown={on_pointer_down}
	ontouchend={on_click}
/>
