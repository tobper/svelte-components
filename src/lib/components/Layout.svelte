<script lang="ts" module>
	import { getContext, setContext } from 'svelte';

	interface LayoutContext {
		header_height: number;
		footer_height: number;
		sidebar_width: number;
	}

	const context_key = Symbol('Layout');

	function set_context(state: LayoutContext) {
		return setContext(context_key, state);
	}

	export function get_layout_context() {
		return getContext<LayoutContext>(context_key);
	}
</script>

<script lang="ts">
    import { set_root_style_property } from '$lib/css.js';
    import { device } from '$lib/device.js';
    import { resize_observer } from '$lib/html.js';
    import { onMount, type Snippet } from 'svelte';

	interface Layout {
		header?: Snippet;
		sidebar?: Snippet;
		main: Snippet;
		footer?: Snippet;
	}

	let { header, sidebar, main, footer }: Layout = $props();

	let header_element = $state<HTMLElement>();
	let footer_element = $state<HTMLElement>();
	let sidebar_element = $state<HTMLElement>();

	const context = $state<LayoutContext>({
		footer_height: 0,
		header_height: 0,
		sidebar_width: 0,
	});

	set_context(context);

	onMount(() => {
		const observers = [
			header_element && resize_observer(header_element, ({ height }) => {
				context.header_height = height;
				set_root_style_property('--layout-header__height', `${height}px`)
			}),
			footer_element && resize_observer(footer_element, ({ height }) => {
				context.footer_height = height;
				set_root_style_property('--layout-footer__height', `${height}px`)
			}),
			sidebar_element && resize_observer(sidebar_element, ({ width }) => {
				context.sidebar_width = width;
				set_root_style_property('--layout-sidebar__width', `${width}px`)
			})
		];

		return function onUnmount() {
			observers.forEach(observer => observer?.disconnect());
		};
	});
</script>

<div class="layout">
	{#if header}
		<header bind:this={header_element}>
			<div class="layout-header">
				{@render header()}
			</div>
		</header>
	{/if}

	<main>
		{#if sidebar && !device.mobile}
			<aside class="layout-sidebar" bind:this={sidebar_element}>
				{@render sidebar()}
			</aside>
		{/if}

		<div class="layout-main">
			{@render main()}
		</div>
	</main>

	{#if footer}
		<footer bind:this={footer_element}>
			<div class="layout-footer">
				{@render footer()}
			</div>
		</footer>
	{/if}
</div>
