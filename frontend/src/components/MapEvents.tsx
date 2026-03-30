import { useMapEvents } from "react-leaflet";
import { useRef } from "react";

function MapEvents() {
	const isFirstLoad = useRef(true);

	useMapEvents({
		moveend: (e) => {
			if (isFirstLoad.current) {
				isFirstLoad.current = false;
				return;
			}

			const map = e.target;
			const center = map.getCenter();

			localStorage.setItem("centerX", center.lng.toString());
			localStorage.setItem("centerY", center.lat.toString());
			localStorage.setItem("zoom", map.getZoom().toString());
		},
	});

	return null;
}

export default MapEvents;
