<script lang="ts" module>
	type FieldProps = ComponentProps<typeof Field>;

	const context_key = Symbol('Form');
	const empty_context: FormContext = {
		error_hints: 'auto',
		error_message: null,
		field_errors: {},
		can_submit: true,
		delayed: false,
		in_progress: false,
		loading: false,
		submitting: false,
		tainted: false,
	};

	// Needed to avoid lint error "'Model' is not defined"
	type Model = object;

	export interface FormContext {
		/** Default value for fields where it is not explicitly specified */
		error_hints: NonNullable<FieldProps['error_hint']>;
		error_message: FormFailure['error_message'];
		field_errors: FormFailure['field_errors'];
		/** Indicates that form is either loading, submitting or not tainted */
		can_submit: boolean;
		/** Indicates that the form is currently submitting and taking longer than expected */
		delayed: boolean;
		/** Indicates that the form is currently loading or submitting */
		in_progress: boolean;
		/** Indicates that the form is currently loading */
		loading: boolean;
		/** Indicates that the form is currently being submitted */
		submitting: boolean;
		/** Indicates that the form values are tainted */
		tainted: boolean;
	}

	export interface FormFailure {
		error_message: string | null;
		field_errors: FieldErrors;
	}

	export type FieldErrors = {
		[field: string]: Array<string>;
	};

	export function get_form_context(): FormContext {
		return getContext(context_key) ?? empty_context;
	}

	function set_context(context: FormContext) {
		setContext(context_key, context);
	}
</script>

<script lang="ts" generics="Model">
	import { applyAction, enhance } from '$app/forms';
	import { beforeNavigate } from '$app/navigation';
	import { getContext, onMount, setContext, untrack, type ComponentProps, type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { classes } from '../../classes.js';
	import { delayed_timer } from '../../reactivity.svelte.js';
	import { unique_id } from '../../unique_id.js';
	import Field from './Field.svelte';

	type SubmitAction = () => Promise<SubmitResult> | void;
	type SubmitResult =
		| { type: 'success'; }
		| { type: 'failure'; error_message: string | null; field_errors: FieldErrors; }
		| undefined;

	interface Form {
		id?: string;
		class?: string;

		/**
		 * This can either be a string, in which case the form will be posted to the specified url,
		 * or it can be a function in which case the function will not be posted and this function
		 * will be called instead.
		 */
		action?: string | SubmitAction;

		/** Default value for fields where it is not explicitly specified */
		error_hints?: FieldProps['error_hint'];
		error_message?: string | null;
		field_errors?: FieldErrors;
		loading?: boolean;
		method?: HTMLFormAttributes['method'];
		model?: Model;
		tainted_navigation_message?: string;

		children?: Snippet;
		content?: Snippet<[FormContext]>;

		on_failure?: (failure: FormFailure) => void;
		on_success?: (result?: Model) => void;
	}

	export function reset() {
		error_message = null;
		field_errors = {};
		reset_tainted();
	}

	let {
		id = $bindable(unique_id()),
		action,
		class: class_name,
		error_hints = 'auto',
		error_message = $bindable(''),
		field_errors = $bindable({}),
		loading = false,
		method = 'POST',
		model,
		tainted_navigation_message,

		children,
		content,

		on_failure,
		on_success,
	}: Form = $props();

	let element = $state<HTMLFormElement>();
	let timer = delayed_timer();
	let submitting = $state(false);
	let untainted_hash = $state('');
	let current_hash = $derived(hash(model));
	let in_progress = $derived(loading || submitting);
	let tainted = $derived(model === undefined || current_hash !== untainted_hash);
	let can_submit = $derived(!in_progress && tainted);

	const context = {
		get delayed() { return timer.delayed; },
		get error_hints() { return error_hints; },
		get error_message() { return error_message; },
		get field_errors() { return field_errors; },
		get can_submit() { return can_submit; },
		get in_progress() { return in_progress; },
		get loading() { return loading; },
		get submitting() { return submitting; },
		get tainted() { return tainted; },
	};

	set_context(context);

	$effect.pre(() => {
		if (loading) {
			error_message = null;
			field_errors = {};
		}
	});

	$effect.pre(() => {
		// Ensure form is reset when model is set to a new object (not when a property is changed)
		model; // eslint-disable-line @typescript-eslint/no-unused-expressions
		untrack(reset);
	});

	onMount(() => {
		const dialog = element?.closest('dialog');
		if (!dialog)
			return;

		dialog.addEventListener('cancel', on_close);

		return function cleanup() {
			dialog.removeEventListener('cancel', on_close);
		}

		function on_close(event: Event) {
			check_navigation(() => event.preventDefault());
		}
	});

	beforeNavigate(navigation => {
		check_navigation(() => navigation.cancel());
	});

	function check_navigation(on_cancel: () => void) {
		if (tainted && tainted_navigation_message) {
			const allow_navigation = window.confirm(tainted_navigation_message);
			if (allow_navigation)
				reset_tainted();
			else
				on_cancel();
		}
	}

	function hash(value: unknown) {
		return JSON.stringify(value);
	}

	function reset_tainted() {
		untainted_hash = current_hash;
	}
</script>

<form
	bind:this={element}
	{id}
	{method}
	action={typeof action === 'string' ? action : undefined}
	class={classes('form', class_name)}
	class:form--delayed={timer.delayed}
	class:form--in_progress={loading || submitting}
	class:form--loading={loading}
	class:form--submitting={submitting}
	class:form--tainted={tainted}
	use:enhance={
		async function prepare_request({ cancel }) {
			error_message = null;
			field_errors = {};

			if (typeof action === 'function') {
				cancel();

				const promise = action();
				if (!promise) // Abort submit if no promise is returned
					return;

				submitting = true;
				timer.start();

				try {
					const result = await promise ?? { type: 'success' };

					if (result.type === 'success')
						// handle_success('data' in result ? result.data : undefined);
						handle_success(undefined);
					else
						handle_failure(result);
				}
				finally {
					submitting = false;
					timer.reset();
				}

				return;
			}

			submitting = true;
			timer.start();

			return function handle_submit_response({ result }) {
				timer.reset()

				// Act as if we're still submitting while redirecting
				if (result.type !== 'redirect')
					submitting = false;

				if (result.type === 'failure') {
					const failure = result.data as FormFailure | undefined;
					handle_failure(failure);
				}

				if (result.type === 'success') {
					const updated_model = result.data as Model | undefined;
					handle_success(updated_model);
				}

				applyAction(result);
			}

			function handle_failure(result?: FormFailure) {
				error_message = result?.error_message ?? '';
				field_errors = result?.field_errors ?? {};

				on_failure?.({ error_message, field_errors });
			}

			function handle_success(updated_model: Model | undefined) {
				if (model && updated_model)
					model = updated_model;

				reset_tainted();
				on_success?.(updated_model);
			}
		}
	}
>
	{@render children?.()}
	{@render content?.(context)}
</form>
