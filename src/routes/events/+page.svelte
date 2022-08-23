<script lang="ts">
	import FullCalendar, { Draggable } from 'svelte-fullcalendar';
	import daygridPlugin from '@fullcalendar/daygrid';
	import timegridPlugin from '@fullcalendar/timegrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import { events as eventsData, getData } from '../../stores/eventStore';

	let events = $eventsData.map((event) => ({
		title: event.name,
		start: event.date
	}));
	console.log(events);

	if (events.length === 0) {
		getData(4, 'all').then(() => {
			events = $eventsData.map((event) => ({
				title: event.name,
				start: event.date,
				backgroundColor: new Date(event.date) < new Date() ? '#d1d5db' : '#79535C',
				borderColor: new Date(event.date) < new Date() ? '#d1d5db' : '#79535C'
			}));
			options.events = events;
		});
	}

	let options = {
		dateClick: handleDateClick,
		droppable: false,
		editable: false,
		events: events,
		eventColor: '#79535C',
		initialView: 'dayGridMonth',
		plugins: [daygridPlugin, timegridPlugin, interactionPlugin],
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay'
		},
		height: '100%',
		weekends: true
	};
	let calendarComponentRef;

	function toggleWeekends() {
		options = { ...options, weekends: !options.weekends };
	}

	function gotoPast() {
		let calendarApi = calendarComponentRef.getAPI();
		calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
	}

	function handleDateClick(event) {
		/* if (confirm('Would you like to add an event to ' + event.dateStr + ' ?')) {
			const { events } = options;
			const calendarEvents = [
				...events,
				{
					title: 'New Event',
					start: event.date,
					allDay: event.allDay
				}
			];
			options = {
				...options,
				events: calendarEvents
			};
		} */
	}
</script>

<svelte:head>
	<title>ASU Calendar</title>
</svelte:head>

<div class="demo-app  ">
	{#if events.length !== 0}
		<div class="demo-app-calendar">
			<FullCalendar bind:this={calendarComponentRef} {options} />
		</div>
	{/if}
</div>

<style>
	:global(* > *) {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.demo-app {
		width: 100vw;
		height: 100vh;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 14px;
	}

	.demo-app-calendar {
		width: 100%;
		flex-grow: 1;
		margin: 0 auto;
		max-width: 900px;
	}
	:global(.draggable) {
		color: white;
		background: #79535c;
		width: fit-content;
		padding: 1rem;
		margin: 1rem;
		cursor: pointer;
	}
</style>
