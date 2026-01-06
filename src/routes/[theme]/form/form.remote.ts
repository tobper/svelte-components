import { form } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const foo_form = form(
	v.object({
		name: v.pipe(v.string(), v.minLength(3, 'Name must be at least three characters.'))
	}),
	async (form_data) => {
		console.log(form_data);

		if (form_data.name === 'error')
			error(400, '400 error')

		return 42;
	}
)
