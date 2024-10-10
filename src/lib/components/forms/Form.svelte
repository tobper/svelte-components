<script lang="ts" module>
	const context_key = Symbol('Form');
	const empty_context: FormContext = {
		error: null,
		field_errors: {},
		loading: false,
		submitting: false,
	};

	export interface FormContext {
		error: FormFailure['error'];
		field_errors: FormFailure['field_errors'];
		loading: boolean;
		submitting: boolean;
	}

	export interface FormFailure {
		error: string | null;
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

<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { getContext, setContext, type Snippet } from 'svelte';
	import { unique_id } from '../../unique_id.js';

	interface Form {
		id?: string;
		class?: string;
		action?: string;
		field_errors?: FieldErrors;
		error?: string | null;
		loading?: boolean;
		method?: string;

		children: Snippet;
		footer?: Snippet<[{ loading: boolean, submitting: boolean }]>;

		on_success?: (result: unknown) => void;
	}

	let {
		id = $bindable(unique_id()),
		action,
		class: class_name,
		error = $bindable(''),
		field_errors = $bindable({}),
		loading = false,
		method = 'POST',

		children,
		footer,

		on_success,
	}: Form = $props();

	let submitting = $state(false);

	set_context({
		get error() { return error; },
		get field_errors() { return field_errors; },
		get loading() { return loading; },
		get submitting() { return submitting; },
	});

	$effect.pre(() => {
		if (loading) {
			error = null;
			field_errors = {};
		}
	});
</script>

<form 
	{id}
	{method}
	{action}
	class={class_name}
	class:form--in_progress={loading || submitting}
	class:form--loading={loading}
	class:form--submitting={submitting}
	use:enhance={
		function prepare_request() {
			error = null;
			field_errors = {};
			submitting = true;

			return function handle_response({ result }) {
				// Act as if we're still submitting while redirecting
				if (result.type !== 'redirect')
					submitting = false;

				if (result.type === 'failure') {
					const failure = result.data as unknown as FormFailure;
					error = failure.error;
					field_errors = failure.field_errors;
					return;
				}

				if (result.type === 'success')
					on_success?.(result.data);

				applyAction(result);
			}
		}
	}
>
	{@render children()}

	{#if footer}
		<footer>
			{@render footer({ loading, submitting })}
		</footer>
	{/if}
</form>
