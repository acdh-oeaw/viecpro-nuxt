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
		<LMap ref="map" :center="[Number(point.lat), Number(point.long)]" :zoom="zoom ?? 13">
			<LTileLayer
				:attribution="attribution"
				:min-zoom="3"
				url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<LMarker :lat-lng="[Number(point.lat), Number(point.long)]" />
		</LMap>
	</div>
</template>
