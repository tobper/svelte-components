<script lang="ts" generics="CommandName extends string, Context">
	export interface KeyBindingsProps<CommandName extends string, Context> {
		commands: {
			[Name in CommandName]: {
				run: (context: Context) => void
				caption?: (context: Context) => string
				valid?: (context: Context) => boolean
			}
		}
		context: Context
		mapping: KeyMap<CommandName>
	}

	export type KeyBinding = string | [key: string, ...modifiers: KeyModifier[]]
	export type KeyModifier = 'alt' | 'ctrl' | 'meta' | 'shift';
	export type KeyMap<Command extends string = string> = {
		[P in Command]?: KeyBinding
	}

	const {
		commands,
		context,
		mapping,
	}: KeyBindingsProps<CommandName, Context> = $props()

	const keys = $derived(
		Map.groupBy(
			Object
				.entries<KeyBinding | undefined>(mapping)
				.map(([command_name, binding]) => {
					if (!binding)
						return;

					const command = commands[command_name as CommandName];
					if (!command)
						return;

					const [key, ...modifiers] = Array.isArray(binding) ? binding : [binding];
					const { run, valid = () => true } = command;

					return {
						key,
						modifiers: {
							alt: modifiers.includes('alt'),
							ctrl: modifiers.includes('ctrl'),
							meta: modifiers.includes('meta'),
							shift: modifiers.includes('shift'),
						},
						run,
						valid,
					};
				})
				.filter(binding => !!binding),
			binding => binding.key
		)
	)

	function handle(event: KeyboardEvent) {
		const command = keys
			.get(event.key)
			?.find(command =>
				command.modifiers.alt === event.altKey &&
				command.modifiers.ctrl === event.ctrlKey &&
				command.modifiers.meta === event.metaKey &&
				command.modifiers.shift === event.shiftKey &&
				command.valid(context)
			)

		if (command) {
			event.preventDefault();
			command.run(context)
		}
	}
</script>

<svelte:window
	onkeydown={event => {
		// Keyboard events using meta key does not trigger keypress so catch them in 'down' instead
		if (event.metaKey)
			handle(event);
	}}
	onkeypress={event => {
		// Commands are not triggered when no modifier is used and focus is in an input
		if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && document.querySelector('input:focus'))
			return;

		handle(event);
	}}
/>
