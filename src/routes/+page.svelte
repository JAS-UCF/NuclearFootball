<script lang="ts">
	// src/routes/+page.svelte
	import { source } from 'sveltekit-sse';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { Input } from '$lib/components/ui/input';

	import type { DecodedMessage, Message } from '$lib/types';
	import TemperatureChart from '$lib/components/custom/TemperatureChart.svelte';
	import { untrack } from 'svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { enhance } from '$app/forms';
	// import TemperatureChart from '$lib/components/custom/TemperatureChart.svelte';

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
		scalingFactor = $state(1),
		r1 = $state(false),
		r2 = $state(false),
		r3 = $state(false),
		last30TemperatureTC1 = $state([{ x: 0, value: 0 }]),
		last30TemperatureTC2 = $state([{ x: 0, value: 0 }]),
		last30TemperatureTC3 = $state([{ x: 0, value: 0 }]),
		last30TemperatureTC4 = $state([{ x: 0, value: 0 }]),
		index = 0;

	let decodedValue = $derived.by(() => {
		try {
			return JSON.parse(
				(JSON.parse($value ?? '{message:""}') as Message).message
			) as DecodedMessage;
		} catch (e) {
			console.warn(e);
			return null;
		}
	});

	// Helper function to update arrays immutably with a max length.
	function updateArray(
		arr: { x: number; value: number }[],
		newItem: { x: number; value: number },
		maxLength = 100
	) {
		const updated = [...arr, newItem];
		// Keep only the most recent `maxLength` items
		return updated.length > maxLength ? updated.slice(updated.length - maxLength) : updated;
	}

	$effect(() => {
		const currentDecodedValue = decodedValue; // Capture the value for this run
		if (currentDecodedValue == null) return;

		try {
			// It's often good practice to read dependencies once at the top
			// if you're doing complex things or using untrack, though not strictly necessary here.
			const newT1 = currentDecodedValue.Thermocouples.tc1;
			const newT2 = currentDecodedValue.Thermocouples.tc2;
			const newT3 = currentDecodedValue.Thermocouples.tc3;
			const newT4 = currentDecodedValue.Thermocouples.tc4;

			// Update simple state
			index++; // Increment index only when decodedValue changes
			t1 = newT1;
			t2 = newT2;
			t3 = newT3;
			t4 = newT4;
			waterTemp = currentDecodedValue.Water.temperature;
			waterPressure = currentDecodedValue.Water.pressure;
			oilTemp = currentDecodedValue.Oil.temperature;
			oilPressure = currentDecodedValue.Oil.pressure;
			force = currentDecodedValue.force;

			// Update history arrays, untracking the read of the previous state
			last30TemperatureTC1 = untrack(() =>
				updateArray(last30TemperatureTC1, { x: index, value: newT1 })
			);
			last30TemperatureTC2 = untrack(() =>
				updateArray(last30TemperatureTC2, { x: index, value: newT2 })
			);
			last30TemperatureTC3 = untrack(() =>
				updateArray(last30TemperatureTC3, { x: index, value: newT3 })
			);
			last30TemperatureTC4 = untrack(() =>
				updateArray(last30TemperatureTC4, { x: index, value: newT4 })
			);

			r1 = currentDecodedValue.Relays.r1;
			r2 = currentDecodedValue.Relays.r2;
			r3 = currentDecodedValue.Relays.r3;
			r4 = currentDecodedValue.Relays.r4;
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
			<Card.Description>
				Below are the temperature readings from the 4 main thermocouples
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="container m-auto grid w-full grid-cols-1 gap-4">
				<div class="flex-1">
					<h2>T1: {t1} / 1024 C</h2>
					<Progress value={t1} max={1024} />
					<TemperatureChart bind:temperature={last30TemperatureTC1}></TemperatureChart>
				</div>
				<div class="flex-1">
					<h2>T2: {t2} / 1024 C</h2>
					<Progress value={t2} max={1024} />
					<TemperatureChart bind:temperature={last30TemperatureTC2}></TemperatureChart>
				</div>
				<div class="flex-1">
					<h2>T3: {t3} / 1024 C</h2>
					<Progress value={t3} max={1024} />
					<TemperatureChart bind:temperature={last30TemperatureTC3}></TemperatureChart>
				</div>
				<div class="flex-1">
					<h2>T4: {t4} / 1024 C</h2>
					<Progress value={t4} max={1024} />
					<TemperatureChart bind:temperature={last30TemperatureTC4}></TemperatureChart>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Oil Stats</Card.Title>
				<Card.Description>
					Below are the live readings from the server on Oil pressure and temperature
				</Card.Description>
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
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Water Stats</Card.Title>
				<Card.Description>
					Below are the live readings from the server on Water pressure and temperature
				</Card.Description>
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
		</Card.Root>
	</div>
	<Card.Root>
		<Card.Header>
			<Card.Title>Force</Card.Title>
			<Card.Description>
				Below is a big gauge describing the force being output by the sensor, NOTE: these are RAW
				values, and will need to be post-processed. If you have a scaling factor, feel free to enter
				it below.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex-1">
				<h2>Force: {force} | Adjusted: {force / scalingFactor}</h2>
				<Progress value={adjustedForce()} max={1000000 / scalingFactor} />
			</div>
			<br />
			<span>
				Scaling factor will take the current value and divide by the factor, this is for display
				only!
			</span>
			<Input placeholder="15" type="number" bind:value={scalingFactor} />
		</Card.Content>
	</Card.Root>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>Relay Drive 1</Card.Title>
				<Card.Description
					>Relay state is currently: <strong>{r1}</strong>
					<br />
					Click the switch below to change the state of the relay, and the text above will update!
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Switch
					onclick={() => {
						document.getElementById('R1')?.click();
					}}
					bind:checked={r1}
				/>
				<form action="?/relay1" method="POST" use:enhance>
					<button type="submit" class="hidden" id="R1">Relay1</button>
				</form>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Relay Drive 2</Card.Title>
				<Card.Description
					>Relay state is currently: <strong>{r2}</strong>
					<br />
					Click the switch below to change the state of the relay, and the text above will update!
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Switch
					onclick={() => {
						document.getElementById('R2')?.click();
					}}
					bind:checked={r2}
				/>
				<form action="?/relay2" method="POST" use:enhance>
					<button type="submit" class="hidden" id="R2">Relay2</button>
				</form>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Relay Drive 3</Card.Title>
				<Card.Description
					>Relay state is currently: <strong>{r3}</strong>
					<br />
					Click the switch below to change the state of the relay, and the text above will update!
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Switch
					onclick={() => {
						document.getElementById('R3')?.click();
					}}
					bind:checked={r3}
				/>
				<form action="?/relay3" method="POST" use:enhance>
					<button type="submit" class="hidden" id="R3">Relay3</button>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</div>
