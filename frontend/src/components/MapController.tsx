import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const MapController = ({ setMap }: { setMap: (map: L.Map) => void }) => {
	const map = useMap();

	useEffect(() => {
		setMap(map);
	}, [map]);

	return null;
};

export default MapController;