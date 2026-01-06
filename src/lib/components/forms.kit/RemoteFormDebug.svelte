<script lang="ts" generics="T extends RemoteFormInput">
    import type { RemoteForm, RemoteFormFields, RemoteFormInput } from '@sveltejs/kit';

    interface FormDebugProps {
    	form: RemoteForm<T, unknown>
    }

    const { form }: FormDebugProps = $props();
    const fields = $derived(form.fields as RemoteFormFields<RemoteFormInput>);
    const text = $derived(
    	JSON.stringify(
           {
               values: fields.value(),
               issues: fields.allIssues()
           },
           null,
           2
       )
    )
</script>

<output>
	<pre>{text}</pre>
</output>
