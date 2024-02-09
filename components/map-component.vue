<script lang="ts" setup>
defineProps<{
	point: {
		lat: string;
		long: string;
	};
	zoom?: number;
}>();

const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
</script>

<template>
	<div class="relative z-0 bg-slate-200">
		<LMap ref="map" :zoom="zoom ?? 13" :center="[Number(point.lat), Number(point.long)]">
			<LTileLayer
				url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
				:attribution="attribution"
				:min-zoom="3"
			/>
			<LMarker :lat-lng="[Number(point.lat), Number(point.long)]" />
		</LMap>
	</div>
</template>
