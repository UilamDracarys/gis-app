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
import { LogOut, Check, Ban } from "lucide-react";
const { BaseLayer, Overlay } = LayersControl;
import auth from "@/services/api/auth";
import { useNavigate } from "react-router-dom";

const Map = ({ djangoItemsRef, editingLayer, onSaveEdits, onCancelEdits }: any) => {
	const navigate = useNavigate();

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
		data.append(
			"geom",
			JSON.stringify((geojson as any).features[0].geometry),
		);

		localStorage.setItem("savedStyles", data.get("style"));
		await featuresApi.saveFeature(data);

		setOpen(false);
		toast.success("Saved!");
	};

	const handleLogout = async () => {
		await auth.logout();
		navigate("/login");
	};

	return (
		<div className="w-full h-screen relative">
			<MapContainer
				center={center}
				zoom={13}
				zoomControl={false}
				style={{ height: "100%", width: "100%" }}
			>
				<button
					className="absolute top-2 left-2 z-9999 bg-white/90 p-3 rounded-md cursor-pointer group"
					onClick={handleLogout}
				>
					<LogOut className="transition-transform group-hover:scale-130 duration-300 " />
				</button>

				{editingLayer && (
					<div className="absolute right-2 top-16 z-9999 flex flex-col gap-1">
					<button className=" bg-green-200/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
					onClick={onSaveEdits}>
						<Check className="transition-transform duration-300 group-hover:scale-130 -disabled:active:text-red-700 " />
					</button>

					<button className=" bg-red-200/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
					onClick={onCancelEdits}>
						<Ban className="transition-transform duration-300 group-hover:scale-130 -disabled:active:text-red-700 " />
					</button>
					</div>
				)}

				<div className="absolute top-2 right-2">
					<LayersControl position="topright">
						<BaseLayer checked={defaultBase === "Dark"} name="Dark">
							<TileLayer
								attribution="&copy; OpenStreetMap contributors &copy; CARTO"
								url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
							/>
						</BaseLayer>

						<BaseLayer
							checked={defaultBase === "Light"}
							name="Light"
						>
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
				</div>

				<ActionBar
					refs={refs}
					openDialog={openDialog}
					editingLayer={editingLayer}
				/>
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
