<!-- js js js js js js js js js js js js js js js js js js js js js js js js js js js -->

<script>
	import { luxon } from './luxon.js';
	import { current } from './js/calendar.js';
	import { includePast } from './js/stores.js';
	import Card from './svelte/Card.svelte';

	let DateTime = luxon.DateTime;
	const calendar = JSON.parse(current); // parse event list from calendar.js

	let now = DateTime.now();
	let eventList = new Array();
	let filter = ['start', 'closed', 'half', 'end'];

	// now = DateTime.fromISO("2022-12-25"); // the future is now (Debug!!!!!)

	class Event {
		constructor(event, closed, hasPassed) {
			this.name = event.name;
			this.date = event.date;
			this.type = event.type;
			this.end = event.end; // can be undefined
			this.noSchoolCount = closed; // int val
			this.hasPassed = hasPassed; // bool val
			this.summerBreak = {
				"date": calendar[0].date,
				"value": isAfterToday(calendar[0].date),
			};
		}
	}

	blobby();

	// functions...

	function blobby() {
		let closed = 0;

		for (const event of calendar) {
			let hasPassed;

			if (event.end) hasPassed = !isAfterToday(event.end)
			else hasPassed = !isAfterToday(event.date);

			eventList = [...eventList, new Event(event, closed, hasPassed)]

			if (!hasPassed && event.type === 'closed') {
				closed += event.duration;
			}
		}
	}

	// boolean: returns true if ISO string date is after today  

	function isAfterToday(date) {
		return DateTime.fromISO(date).startOf("day") >= now.startOf("day");
	}

</script>

<!-- html html html html html html html html html html html html html html html html -->

<div>
	{#each eventList as event}
		{#if filter.includes(event.type) && ($includePast || !event.hasPassed)}
			<Card {event}></Card>
		{/if}
	{/each}
</div>