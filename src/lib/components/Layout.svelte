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
	import { on_resize } from '$lib/attachments';
	import { type Snippet } from 'svelte';
	import { set_root_style } from '../css.js';
	import { device } from '../device.js';
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

	set_context(context);

	$effect.pre(() => {
		context.sidebar_fixed = !device.mobile && media.sidebar_over_threshold
	});

	onNavigate(() => {
		context.sidebar_visible = false;
	});
</script>

<div class="layout">
	{#if header}
		<header {@attach on_resize(({ height }) => {
			context.header_height = height;
			set_root_style('--layout-header__height', `${height}px`)
		})}>
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
				{@attach on_resize(({ width }) => {
					context.sidebar_width = width;
					set_root_style('--layout-sidebar__width', `${width}px`)
				})}
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
		<footer {@attach on_resize(({ height }) => {
			context.footer_height = height;
			set_root_style('--layout-footer__height', `${height}px`)
		})}>
			<div class="layout-footer">
				{@render footer(context)}
			</div>
		</footer>
	{/if}
</div>
