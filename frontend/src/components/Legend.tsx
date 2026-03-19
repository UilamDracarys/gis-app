import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const Legend = () => {
	const map = useMap();

	useEffect(() => {
		const legend = (L.control as any)({ position: "topleft" });

		legend.onAdd = () => { 
			const div = L.DomUtil.create("div", "info legend");

			div.innerHTML = `
        <h4>Legend</h4>
        <i style="background:#ff0000"></i> High<br>
        <i style="background:#ffa500"></i> Medium<br>
        <i style="background:#00ff00"></i> Low
      `;

			return div;
		};

		legend.addTo(map);

		return () => {
			legend.remove(); // cleanup on unmount
		};
	}, [map]);

	return null;
};

export default Legend;
