<script lang="ts">
	import { Card, CardContent, Kbd, PageContent, Stack } from '$lib/index.js';
</script>

<PageContent header="Kbd">
	<Card>
		<CardContent header="Keys">
			<Stack horizontal>
				<Kbd key="a" />
				<Kbd key="b" />
				<Kbd key="backspace" />
				<Kbd key="enter" />
				<Kbd key="space" />
				<Kbd key="tab" />
			</Stack>
		</CardContent>
		<CardContent header="Modifiers">
			<Stack horizontal>
				<Kbd key="alt" />
				<Kbd key="control" />
				<Kbd key="shift" />
				<Kbd key="meta" />
			</Stack>
		</CardContent>
		<CardContent header="Combination">
			<Stack horizontal>
				<Kbd key={['meta', 'enter']} />
				<Kbd key={['alt', 'shift', 'v']} />
			</Stack>
		</CardContent>
	</Card>
</PageContent>
