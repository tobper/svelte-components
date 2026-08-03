<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, Card, CardContent, CommandPalette, handle_keyboard_event, Kbd, match, PageContent } from '$lib/index.js';
	import { IconAppWindow, IconSettings } from '@tabler/icons-svelte-runes';
	import { nav_items } from '../data';
	import { get_scheme } from '../theme_context.svelte';

	let visible = $state(false);
	const show = () => visible = true;
	const scheme = get_scheme()
</script>

<svelte:window onkeydown={handle_keyboard_event({
	'k': event => event.metaKey && !visible && show()
})} />

<PageContent header="Command palette">
	<Card>
		<CardContent>
			<Button type="outlined" text="Open" onclick={() => visible = true}>
				{#snippet icon()}
					<IconAppWindow />
				{/snippet}
			</Button>
			<div class="flow-items gap-tiny">
				Or press
				<Kbd key="esc" />
			</div>
		</CardContent>
	</Card>
</PageContent>

<CommandPalette
	bind:visible
	options={[
		...nav_items.map(([icon, name, path]) => ({
			icon,
			label: name,
			state: 'Page',
			action: {
				name: `Goto "${name}" page`,
				run: () => goto(resolve(`/neomorphism${path}`))
			}
		})),
		{
			icon: IconSettings,
			label: 'Scheme',
			state: () => `Current: ${scheme.current}`,
			action: {
				default: {
					run: () => scheme.current = match(scheme.current, {
						'dark': 'light',
						'light': 'system',
						'system': 'dark',
					}),
					name: 'Toggle scheme',
				},
				shift: {
					run: () => scheme.current = 'dark',
					name: 'Set dark scheme',
				},
				meta: {
					run: () => scheme.current = 'light',
					name: 'Set light scheme',
				}
			}
		},
		{
			icon: IconSettings,
			label: 'Dark scheme',
			state: () => `Current: ${scheme.current}`,
			action: {
				run: () => scheme.current = 'dark',
				name: 'Switch to dark scheme'
			}
		},
		{
			icon: IconSettings,
			label: 'Light scheme',
			state: () => `Current: ${scheme.current}`,
			action: {
				run: () => scheme.current = 'light',
				name: 'Switch to light scheme'
			}
		}
	]}
/>
