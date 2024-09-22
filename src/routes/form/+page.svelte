<script lang="ts">
	import { Card, CheckButton, PageHeader, RadioButton, RadioGroup } from '$lib/index.js';
	import { IconCheck, IconX } from '@tabler/icons-svelte';
</script>

<article class="page-content">
	<PageHeader text="Check button" />
	<Card>
		<div class="flow-items">
			<CheckButton text="Default" />
			<CheckButton text="Checked" class="button--pressed" />
			<CheckButton disabled text="Disabled" />
			<CheckButton disabled text="Checked and disabled" checked />
		</div>

		<h3>Group</h3>
		<div class="flow-items">
			<div class="button-group">
				<CheckButton text="Yes" checked />
				<CheckButton text="No" />
				<CheckButton text="Maybe" />
			</div>
		</div>

		<h3>Animated</h3>
		<div class="flow-items">
			<CheckButton animation="fade" text="Fade" content={icon_content} />
			<CheckButton animation="fade" content={icon_content} />
			<CheckButton animation="flip" text="Flip" content={icon_content} />
			<CheckButton animation="flip" content={icon_content} />
			<CheckButton animation="rotate" text="Rotate" content={icon_content} />
			<CheckButton animation="rotate" content={icon_content} />

			{#snippet icon_content(checked: boolean)}
				{@const Icon = checked ? IconCheck : IconX}
				<Icon />
			{/snippet}
		</div>
	</Card>
</article>

<article class="page-content">
	<PageHeader text="Radio button" />
	<Card>
		<div class="flow-items">
			<RadioGroup selected_value="yes">
				<RadioButton value="yes" text="Yes" />
				<RadioButton value="no" text="No" />
				<RadioButton value="maybe" text="Maybe" />
			</RadioGroup>
		</div>
		<div class="flow-items">
			<RadioGroup disabled selected_value="1">
				<RadioButton value="1" text="Disabled 1" />
				<RadioButton value="2" text="Disabled 2" />
			</RadioGroup>
		</div>
	</Card>
</article>
