import { getContext, setContext, type ComponentProps } from 'svelte';
import type Field from './Field.svelte';

const context_key = Symbol('Form');
const empty_context: FormContext = Object.freeze({
	error_hints: 'auto',
	error_message: null,
	field_errors: {},
	can_submit: true,
	delayed: false,
	in_progress: false,
	loading: false,
	submitting: false,
	tainted: false,
})

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

export type FieldProps = ComponentProps<typeof Field>;

export type FieldErrors = {
	[field: string]: Array<string>;
};

export function get_form_context(): FormContext {
	return getContext(context_key) ?? empty_context;
}

export function set_form_context(context: FormContext) {
	setContext(context_key, context);
}
