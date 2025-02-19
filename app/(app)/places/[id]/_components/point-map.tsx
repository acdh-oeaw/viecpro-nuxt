"use client";

import "leaflet/dist/leaflet.css";

import type { LatLngExpression } from "leaflet";
import type { ReactNode } from "react";
import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";

interface PointMapProps {
	latitude: number;
	longitude: number;
}

export function PointMap(props: PointMapProps): ReactNode {
	const { longitude, latitude } = props;

	const position: LatLngExpression = [latitude, longitude];

	return (
		<div className="relative h-96 w-full overflow-hidden rounded-md border border-brand-300">
			<MapContainer
				center={position}
				className="absolute inset-0"
				// scrollWheelZoom={false}
				zoom={13}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<CircleMarker center={position} radius={10} />
			</MapContainer>
		</div>
	);
}
