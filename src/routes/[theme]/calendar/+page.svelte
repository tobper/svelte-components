<script lang="ts">
	import { Calendar, Card, CardContent, PageContent } from '$lib/index.js';
	import { get_date_only_text } from '@tobper/eon';

	let date = $state(null);
</script>

<PageContent header="Calendar">
	<Card>
		<CardContent>
			<Calendar bind:date />
			<output>
				Selected: {date ? get_date_only_text(date) : '-'}
			</output>
		</CardContent>
	</Card>
</PageContent>
