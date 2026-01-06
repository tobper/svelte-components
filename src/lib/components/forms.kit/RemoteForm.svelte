<script lang="ts" generics="Model extends RemoteFormInput, Result">
	import { beforeNavigate } from '$app/navigation';
	import { on } from '$lib/html.js';
	import { isHttpError, type RemoteForm, type RemoteFormFields, type RemoteFormInput, type RemoteFormIssue } from '@sveltejs/kit';
	import { tick, untrack, type Snippet } from 'svelte';
	import { delayed_timer } from '../../reactivity.svelte.js';
	import { unique_id } from '../../unique_id.js';
	import { set_form_context, type FieldErrors, type FieldProps, type FormContext } from '../forms/form_context.svelte.js';

	interface RemoteFormProps {
		id?: string;
		error_hints?: FieldProps['error_hint'];
		error_message?: string | null;
		form: Omit<RemoteForm<Model, Result>, 'for'>;
		loading?: boolean;
		tainted_navigation_message?: string;

		children?: Snippet;
		content?: Snippet<[FormContext]>;

		on_error?: (error: unknown) => Promise<void> | void;
		on_failure?: (issues: RemoteFormIssue[]) => Promise<void> | void;
		on_success?: (form: { result: Result | undefined, data: Model }) => Promise<void> | void;
	}

	export function reset() {
		error_message = null;
		field_errors = {};
		reset_tainted();
	}

	let {
		id = $bindable(unique_id()),
		error_hints = 'auto',
		error_message = $bindable(null),
		form,
		loading = false,
		tainted_navigation_message,

		children,
		content,

		on_error,
		on_failure,
		on_success,
	}: RemoteFormProps = $props();

	const form_fields = $derived(form.fields as RemoteFormFields<RemoteFormInput>);
	const form_value = $derived(form_fields.value());
	const form_issues = $derived(form_fields.allIssues());

	let field_errors = $derived.by<FieldErrors>(() => {
		if (!form_issues)
			return {}

		return Object.fromEntries(
			form_issues.map(issue => [
				issue.path.reduce(
					(name, child) =>
						name +
						(
							typeof child === 'number'
								? `[${child}]`
								: (name ? '.' : '') + child
						),
					''
				),
				[issue.message]
			])
		)
	})
	let submit_timer = delayed_timer();
	let submitting = $derived(form.pending > 0);
	let current_hash = $derived(hash($state.snapshot(form_value)));
	let untainted_hash = $state.raw($state.snapshot(current_hash));
	let in_progress = $derived(loading || submitting);
	let tainted = $derived(current_hash !== untainted_hash);
	let can_submit = $derived(!in_progress && tainted);

	const context = {
		get delayed() { return submit_timer.delayed; },
		get error_hints() { return error_hints; },
		get error_message() { return error_message; },
		get field_errors() { return field_errors; },
		get can_submit() { return can_submit; },
		get in_progress() { return in_progress; },
		get loading() { return loading; },
		get submitting() { return submitting; },
		get tainted() { return tainted; },
	};

	set_form_context(context);

	$effect.pre(() => {
		// Ensure form is reset when form is set to a new object (not when a property is changed)
		form; // eslint-disable-line @typescript-eslint/no-unused-expressions
		untrack(reset);
	});

	beforeNavigate(navigation => {
		check_navigation(() => navigation.cancel());
	});

	function check_navigation(on_cancel: () => void) {
		if (tainted && tainted_navigation_message) {
			const allow_navigation = window.confirm(tainted_navigation_message);
			if (!allow_navigation)
				on_cancel();
		}
	}

	async function focusInvalid(form: HTMLElement) {
	   await tick();

	   form
			.querySelector<HTMLElement>(':is(input, select, textarea)[aria-invalid]:not(.hidden, [type=hidden], :disabled)')
			?.focus();
   }

	function hash(value: unknown) {
		return JSON.stringify(value);
	}

	function reset_tainted() {
		untainted_hash = current_hash;
	}

	function dialog_handler(element: HTMLElement) {
		const dialog = element?.closest('dialog');
		if (!dialog)
			return;

		return on(dialog, {
			cancel(event) {
				check_navigation(() => event.preventDefault());
			}
		})
	}
</script>

<form
	{@attach dialog_handler}
	{...form.enhance(
		async ({ form: form_element, data, submit }) => {
			if (submitting)
				return;

			error_message = '';
			submitting = true;
			submit_timer.start();

			try {
				await submit();

				if (form_issues) {
					await on_failure?.(form_issues);
					await focusInvalid(form_element);
				}
				else {
					await on_success?.({ data, result: form.result });
				}
			}
			catch (error) {
				if (isHttpError(error) && error.status === 400)
					error_message = error.body.message;

				await on_error?.(error);
			}
			finally {
				submitting = false;
				submit_timer.reset();
			}
		}
	)}
	{id}
	class={['form', {
		'form--delayed': submit_timer.delayed,
		'form--in_progress': loading || submitting,
		'form--loading': loading,
		'form--submitting': submitting,
		'form--tainted': tainted
	}]}
>
	{@render children?.()}
	{@render content?.(context)}
</form>
