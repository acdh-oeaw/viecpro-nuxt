"use client";

import "leaflet/dist/leaflet.css";

import type { LatLngExpression, Map as LeafletMap } from "leaflet";
import { type ReactNode, use, useEffect, useRef } from "react";
import { DisclosureStateContext } from "react-aria-components";
import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";

interface PointMapProps {
	latitude: number;
	longitude: number;
}

export function PointMap(props: PointMapProps): ReactNode {
	const { longitude, latitude } = props;

	const position: LatLngExpression = [latitude, longitude];

	const mapRef = useRef<LeafletMap | null>(null);

	const context = use(DisclosureStateContext);
	const isExpanded = context?.isExpanded ?? false

	useEffect(() => {
		if (isExpanded) {
			/** Attempt at fixing https://github.com/acdh-oeaw/viecpro-nuxt/issues/178. */
			mapRef.current?.invalidateSize();
		}
	}, [isExpanded]);

	return (
		<div className="relative h-96 w-full overflow-hidden rounded-md border border-brand-100">
			<MapContainer
				ref={mapRef}
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
