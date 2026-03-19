import {
	MapContainer,
	TileLayer,
	LayersControl,
	FeatureGroup,
} from "react-leaflet";
import ActionBar from "./ActionBar";
import { useRef, useState } from "react";
import FeatureDialog from "./FeatureDialog";
import L from "leaflet";
import "leaflet-draw";
import { toast } from "react-toastify";
import featuresApi from "@/services/api/features";
import Legend from "./Legend";

const { BaseLayer, Overlay } = LayersControl;

const Map = ({ djangoItemsRef }: any) => {
	const center: [number, number] = [10.493574598800125, 123.41472829999998];
	const savedItemsRef = useRef<L.FeatureGroup | null>(null);
	const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
	const refs = {
		savedItemsRef: savedItemsRef,
		drawnItemsRef: drawnItemsRef,
		djangoItemsRef: djangoItemsRef,
	};

	const defaultBase = localStorage.getItem("basemap") || "Dark";

	const [open, setOpen] = useState(false);

	const openDialog = () => {
		setOpen(true);
	};

	const handleCancel = () => {
		drawnItemsRef.current?.clearLayers();
		setOpen(false);
	};

	const handleSave = async (data: any) => {

		const geojson = drawnItemsRef.current?.toGeoJSON();
		
		L.geoJSON(geojson, {
			style: JSON.parse(data.get("style")),
			pointToLayer: (feature: any, latlng: L.LatLngExpression) => {
				return L.circleMarker(latlng, feature.properties?.style || {});
			},
			onEachFeature: (_feature, layer) => {
				savedItemsRef.current?.addLayer(layer);
			},
		});

		drawnItemsRef.current?.clearLayers();
		data.append("geom", JSON.stringify((geojson as any).features[0].geometry));

		localStorage.setItem("savedStyles", data.get("style"));
		await featuresApi.saveFeature(data);
		
		setOpen(false);
		toast.success("Saved!");
	};

	return (
		<div className="w-full h-screen relative">
			<MapContainer
				center={center}
				zoom={13}
				zoomControl={false}
				style={{ height: "100%", width: "100%" }}
			>
				<LayersControl position="topright">
					<BaseLayer checked={defaultBase === "Dark"} name="Dark">
						<TileLayer
							attribution="&copy; OpenStreetMap contributors &copy; CARTO"
							url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
						/>
					</BaseLayer>

					<BaseLayer checked={defaultBase === "Light"} name="Light">
						<TileLayer
							attribution="&copy; OpenStreetMap contributors &copy; CARTO"
							url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
						/>
					</BaseLayer>

					<BaseLayer
						checked={defaultBase === "OpenStreetMap"}
						name="OpenStreetMap"
					>
						<TileLayer
							attribution="&copy; OpenStreetMap contributors"
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
					</BaseLayer>

					<Overlay checked name="Saved Features">
						<FeatureGroup ref={savedItemsRef} />
					</Overlay>

					<Overlay checked name="Drawn Features">
						<FeatureGroup ref={drawnItemsRef} />
					</Overlay>

					<Overlay checked name="Django Features">
						<FeatureGroup ref={djangoItemsRef} />
					</Overlay>
				</LayersControl>
				<Legend />
				<ActionBar refs={refs} openDialog={openDialog}  />
			</MapContainer>
			<FeatureDialog
				open={open}
				setOpen={setOpen}
				onCancel={handleCancel}
				onSave={handleSave}
			/>
		</div>
	);
};

export default Map;
