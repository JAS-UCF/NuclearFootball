<script lang="ts">
	// src/routes/+page.svelte
	import { source } from 'sveltekit-sse';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { Input } from '$lib/components/ui/input';

	import type { DecodedMessage, Message } from '$lib/types';

	const value = source('/events').select('message');
	let t1 = $state(0),
		t2 = $state(0),
		t3 = $state(0),
		t4 = $state(0),
		waterTemp = $state(0),
		waterPressure = $state(0),
		oilTemp = $state(0),
		oilPressure = $state(0),
		force = $state(0),
		scalingFactor = $state(1);
	$effect(() => {
		try {
			let decodedValue = JSON.parse(
				(JSON.parse($value ?? '{message:""}') as Message).message
			) as DecodedMessage;
			t1 = decodedValue.Thermocouples.tc1;
			t2 = decodedValue.Thermocouples.tc2;
			t3 = decodedValue.Thermocouples.tc3;
			t4 = decodedValue.Thermocouples.tc4;
			waterTemp = decodedValue.Water.temperature;
			waterPressure = decodedValue.Water.pressure;
			oilTemp = decodedValue.Oil.temperature;
			oilPressure = decodedValue.Oil.pressure;
			force = decodedValue.force;
		} catch (error) {
			console.warn(error);
		}
	});
	function adjustedForce() {
		return force / scalingFactor;
	}
</script>

<div class="container m-auto grid w-full gap-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Thermocouples</Card.Title>
			<Card.Description
				>Below are the temperature readings from the 4 main thermocouples</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="container m-auto grid w-full grid-cols-1 gap-4">
				<div class="flex-1">
					<h2>T1: {t1} / 1024 C</h2>
					<Progress value={t1} max={1024} />
				</div>
				<div class="flex-1">
					<h2>T2: {t2} / 1024 C</h2>
					<Progress value={t2} max={1024} />
				</div>
				<div class="flex-1">
					<h2>T3: {t3} / 1024 C</h2>
					<Progress value={t3} max={1024} />
				</div>
				<div class="flex-1">
					<h2>T4: {t4} / 1024 C</h2>
					<Progress value={t4} max={1024} />
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Oil Stats</Card.Title>
				<Card.Description
					>Below are the live readings from the server on Oil pressure and temperature</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<div class="container m-auto grid w-full grid-cols-1 gap-4">
					<div class="flex-1">
						<h2>Temperature: {oilTemp} / 120 C</h2>
						<Progress value={oilTemp} max={120} />
					</div>
					<div class="flex-1">
						<h2>Pressure: {oilPressure} / 100PSI</h2>
						<Progress value={oilPressure} max={100} />
					</div>
				</div>
			</Card.Content>
			<Card.Footer>
				<p>Card Footer</p>
			</Card.Footer>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Water Stats</Card.Title>
				<Card.Description
					>Below are the live readings from the server on Water pressure and temperature</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<div class="container m-auto grid w-full grid-cols-1 gap-4">
					<div class="flex-1">
						<h2>Temperature: {waterTemp} / 100 C</h2>
						<Progress value={waterTemp} max={100} />
					</div>
					<div class="flex-1">
						<h2>Pressure: {waterPressure} / 100PSI</h2>
						<Progress value={waterPressure} max={100} />
					</div>
				</div>
			</Card.Content>
			<Card.Footer>
				<p>Card Footer</p>
			</Card.Footer>
		</Card.Root>
	</div>
	<Card.Root>
		<Card.Header>
			<Card.Title>Force</Card.Title>
			<Card.Description
				>Below is a big gauge describing the force being output by the sensor, NOTE: these are RAW
				values, and will need to be post-processed, if you have a scaling factor, feel free to enter
				it below</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="flex-1">
				<h2>Force: {force} | Adjusted: {force / scalingFactor}</h2>
				<Progress value={adjustedForce()} max={1000000 / scalingFactor} />
			</div>
			<br />
			<span>
				Scaling factor will take the current value / following value, this is for display only!</span
			>
			<Input placeholder="15" type="number" bind:value={scalingFactor} />
		</Card.Content>
		<Card.Footer>
			<p>Card Footer</p>
		</Card.Footer>
	</Card.Root>
</div>
