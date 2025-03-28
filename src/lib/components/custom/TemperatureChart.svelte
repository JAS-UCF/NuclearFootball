<script lang="ts">
	import { Axis, Chart, Legend, LinearGradient, Spline, Svg } from 'layerchart';
	import { scaleSequential } from 'd3-scale';
	import { extent, ticks } from 'd3-array';
	import { interpolateTurbo } from 'd3-scale-chromatic';
	import { formatDate, PeriodType } from '@layerstack/utils';
	import * as Table from '$lib/components/ui/table';

	let { temperature = $bindable() }: { temperature: { x: number; value: number }[] } = $props();

	let temperatureColor = $derived(
		scaleSequential(extent(temperature, (d) => d.value) as [number, number], interpolateTurbo)
	);

	function getMinMaxMode(data: string | any[]) {
		if (!data.length) return null;

		let min = Infinity;
		let max = -Infinity;
		let frequencyMap = {};
		let mode = null;
		let maxFrequency = 0;

		for (const { value } of data) {
			if (value < min) min = value;
			if (value > max) max = value;

			frequencyMap[value] = (frequencyMap[value] || 0) + 1;
			if (frequencyMap[value] > maxFrequency) {
				maxFrequency = frequencyMap[value];
				mode = value;
			}
		}

		return { min, max, mode };
	}
</script>

<div class="p-4">
	{#if temperature}
		<div class="h-[300px]">
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
		</div>
		<Table.Root>
			<Table.Caption>Current Aggregate Stats</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Min</Table.Head>
					<Table.Head>Max</Table.Head>
					<Table.Head>Mode</Table.Head>
					<Table.Head class="text-right">Average</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="font-medium">{getMinMaxMode(temperature)?.min}</Table.Cell>
					<Table.Cell>{getMinMaxMode(temperature)?.max}</Table.Cell>
					<Table.Cell>{getMinMaxMode(temperature)?.mode}</Table.Cell>
					<Table.Cell class="text-right"
						>{temperature.reduce((p, x, i) => ({ x: 0, value: p.value + x.value })).value /
							temperature.length}</Table.Cell
					>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	{/if}
</div>
