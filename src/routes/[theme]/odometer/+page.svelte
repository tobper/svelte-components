<script lang="ts">
	import Stack from '$lib/components/Stack.svelte';
	import { Button, Card, CardContent, Odometer, PageContent } from '$lib/index.js';

	const get_number = () => (Math.random() * 10000) - 5000;
	const get_time = () => new Date();

	const format_currency = (value: number) =>
		value.toLocaleString('sv', { currency: 'SEK', style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const format_time = (value: Date) =>
		value.toLocaleTimeString('sv', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

	let number = $state(get_number());
	let time = $state(get_time());

	$effect(() => {
		const interval = setInterval(() => time = get_time(), 1000);
		return () => clearInterval(interval);
	});
</script>

<PageContent header="Odometer">
	<Card>
		<CardContent header="Currency">
			<Stack horizontal>
				<Button text="Update" onclick={() => number = get_number()} />
				<div class="number">
					<Odometer
						class={{
							'text-positive': number > 0,
							'text-negative': number < 0,
						}}
						format={format_currency}
						value={number}
					/>
				</div>
			</Stack>
		</CardContent>

		<CardContent header="Time">
			<Odometer format={format_time} value={time} />
		</CardContent>
	</Card>
</PageContent>

<style>
	.number {
		text-align: right;
		width: 100px;
	}
</style>
