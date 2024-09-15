<script lang="ts">
	import { Card, CheckButton, PageHeader, RadioButton, RadioGroup } from '$lib/index.js';
</script>

<article class="page-content">
	<PageHeader text="Check button" />
	<Card>
		<div class="flow-items">
			<div class="button-group">
				<CheckButton text="Yes" checked />
				<CheckButton text="No" />
				<CheckButton text="Maybe" />
			</div>

			<CheckButton text="Single" />
		</div>
		<div class="flow-items">
			<CheckButton transition="fade">
				{#snippet state_checked()}Faded{/snippet}
				{#snippet state_unchecked()}Fade{/snippet}
			</CheckButton>
			<CheckButton transition="flip">
				{#snippet state_checked()}Flipped{/snippet}
				{#snippet state_unchecked()}Flip{/snippet}
			</CheckButton>
			<CheckButton transition="rotate">
				{#snippet state_checked()}Rotated{/snippet}
				{#snippet state_unchecked()}Rotate{/snippet}
			</CheckButton>
		</div>
		<div class="flow-items">
			<CheckButton disabled text="Disabled" />
			<CheckButton disabled text="Checked and disabled" checked />
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
