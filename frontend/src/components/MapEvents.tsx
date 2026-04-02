import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

function MapEvents() {
	const map = useMap();
	const hasInitialized = useRef(false);

	// ✅ run once when map is ready
	useEffect(() => {
		if (!map || hasInitialized.current) return;

		const center = map.getCenter();

		localStorage.setItem("centerX", center.lng.toString());
		localStorage.setItem("centerY", center.lat.toString());
		localStorage.setItem("zoom", map.getZoom().toString());

		hasInitialized.current = true;
	}, [map]);

	// ✅ track movements
	useEffect(() => {
		if (!map) return;

		const handleMoveEnd = () => {
			const center = map.getCenter();

			localStorage.setItem("centerX", center.lng.toString());
			localStorage.setItem("centerY", center.lat.toString());
			localStorage.setItem("zoom", map.getZoom().toString());
		};

		map.on("moveend", handleMoveEnd);

		return () => {
			map.off("moveend", handleMoveEnd);
		};
	}, [map]);

	return null;
}

export default MapEvents;