<script lang="ts">
	import { Axis, Chart, Legend, LinearGradient, Spline, Svg } from 'layerchart';
	import { scaleSequential } from 'd3-scale';
	import { extent, ticks } from 'd3-array';
	import { interpolateTurbo } from 'd3-scale-chromatic';
	import { formatDate, PeriodType } from '@layerstack/utils';

	let { temperature = $bindable() }: { temperature: { x: number; value: number }[] } = $props();

	let temperatureColor = $derived(
		scaleSequential(extent(temperature, (d) => d.value) as [number, number], interpolateTurbo)
	);
</script>

<div class="h-[300px] rounded border p-4">
	{#if temperature}
		<Chart bind:data={temperature} x="x" y="value" yNice padding={{ left: 16, bottom: 24 }}>
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" rule />
				<LinearGradient
					stops={ticks(1, 0, 10).map(temperatureColor.interpolator())}
					vertical
					let:gradient
				>
					<Spline class="stroke-2" stroke={gradient} />
				</LinearGradient>
			</Svg>
			<Legend
				scale={temperatureColor}
				title="Temperature (°C)"
				placement="top-right"
				width={240}
				class="-top-[14px]"
			/>
		</Chart>
	{/if}
</div>
