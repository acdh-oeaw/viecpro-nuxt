<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { map, marker, tileLayer } from "leaflet";

const props = defineProps<{
	points: {
		lat: string;
		long: string;
		name?: string;
	};
	name: string;
	zoom?: number;
	zoomOut?: boolean;
}>();

onMounted(() => {
	let mapVar = map(`map-${props.name}`).setView([props.points.lat, props.points.long], 13);

	tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		minZoom: 3,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(mapVar);

	marker([props.points.lat, props.points.long]).addTo(mapVar);

	if (props.zoom) mapVar.setZoom(props.zoom);
	if (props.zoomOut) mapVar.zoomOut();
});
</script>

<template>
	<div :id="`map-${name}`" class="relative z-0 bg-slate-200" />
</template>
