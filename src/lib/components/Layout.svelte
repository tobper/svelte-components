<script lang="ts" module>
	import { getContext, onDestroy, setContext } from 'svelte';

	const context_key = Symbol('Layout');

	export interface LayoutContext {
		header_height: number;
		footer_height: number;
		sidebar_width: number;
		sidebar_fixed: boolean;
		sidebar_visible: boolean;
	}

	export function get_layout_context() {
		return getContext<LayoutContext>(context_key);
	}

	function set_context(state: LayoutContext) {
		return setContext(context_key, state);
	}
</script>

<script lang="ts">
    import { onNavigate } from '$app/navigation';
    import { onMount, type Snippet } from 'svelte';
    import { set_root_style } from '../css.js';
    import { device } from '../device.js';
    import { resize_observer } from '../html.js';
    import { media_queries } from '../media.svelte.js';

	interface Layout {
		header?: Snippet<[LayoutContext]>;
		sidebar?: Snippet<[LayoutContext]>;
		main: Snippet<[LayoutContext]>;
		footer?: Snippet<[LayoutContext]>;
	}

	const context = $state<LayoutContext>({
		footer_height: 0,
		header_height: 0,
		sidebar_width: 0,
		sidebar_fixed: false,
		sidebar_visible: false,
	});

	const media = media_queries({
		sidebar_over_threshold: '(width >= 800px)',
	}, onDestroy);

	let { header, sidebar, main, footer }: Layout = $props();

	let header_element = $state<HTMLElement>();
	let footer_element = $state<HTMLElement>();
	let sidebar_element = $state<HTMLElement>();

	set_context(context);

	$effect.pre(() => {
		context.sidebar_fixed = !device.mobile && media.sidebar_over_threshold
	});

	onMount(() => {
		const observers = [
			header_element && resize_observer(header_element, ({ height }) => {
				context.header_height = height;
				set_root_style('--layout-header__height', `${height}px`)
			}),
			footer_element && resize_observer(footer_element, ({ height }) => {
				context.footer_height = height;
				set_root_style('--layout-footer__height', `${height}px`)
			}),
			sidebar_element && resize_observer(sidebar_element, ({ width }) => {
				context.sidebar_width = width;
				set_root_style('--layout-sidebar__width', `${width}px`)
			})
		];

		return function onUnmount() {
			observers.forEach(observer => observer?.disconnect());
		};
	});

	onNavigate(() => {
		context.sidebar_visible = false;
	});
</script>

<div class="layout">
	{#if header}
		<header bind:this={header_element}>
			<div class="layout-header">
				{@render header(context)}
			</div>
		</header>
	{/if}

	<main>
		{#if sidebar}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<aside
				bind:this={sidebar_element}
				class="layout-sidebar"
				class:layout-sidebar--fixed={context.sidebar_fixed}
				class:layout-sidebar--folding={!context.sidebar_fixed}
				class:layout-sidebar--visible={context.sidebar_visible}
				onclick={({ target }) => {
					// Hide sidebar if a link inside is clicked
					if (target instanceof Element && target.closest('a')) {
						context.sidebar_visible = false;
					}
				}}
			>
				{@render sidebar(context)}
			</aside>
		{/if}

		<div class="layout-main">
			{@render main(context)}
		</div>
	</main>

	{#if footer}
		<footer bind:this={footer_element}>
			<div class="layout-footer">
				{@render footer(context)}
			</div>
		</footer>
	{/if}
</div>
