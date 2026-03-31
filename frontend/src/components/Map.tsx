import {
	MapContainer,
	TileLayer,
	LayersControl,
	FeatureGroup,
} from "react-leaflet";
import ActionBar from "./ActionBar";
import { useRef, useState } from "react";
import FeatureDialog from "./FeatureDialog";
import FeatureLoader from "./FeatureLoader";
import L from "leaflet";
import "leaflet-draw";
import { toast } from "react-toastify";
import featuresApi from "@/services/api/features";
import { Check, Ban, X } from "lucide-react";
const { BaseLayer } = LayersControl;
import ResizeMap from "./ResizeMap";
import { useSidebar } from "./ui/sidebar";
import MapEvents from "./MapEvents";
import { Input } from "./ui/input";
import MapController from "./MapController";

const Map = () => {
	const center: [number, number] = [
		Number(localStorage.getItem("centerY")) ?? 10.493574598800125,
		Number(localStorage.getItem("centerX")) ?? 123.41472829999998,
	];
	const zoom: number = Number(localStorage.getItem("zoom")) ?? 13;
	const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
	const djangoItemsRef = useRef<L.FeatureGroup | null>(null);
	const { open: isSidebarOpen } = useSidebar();

	const [loading, setLoading] = useState(false);
	const [editingLayer, setEditingLayer] = useState<any>(null);

	const refs = {
		drawnItemsRef: drawnItemsRef,
		djangoItemsRef: djangoItemsRef,
	};

	const editingLayerRef = useRef<any>(null);
	const [map, setMap] = useState<L.Map | null>(null);

	const defaultBase = localStorage.getItem("basemap") || "Dark";

	const [open, setOpen] = useState(false);
	const [features, setFeatures] = useState([]);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [editingFeature, setEditingFeature] = useState<any>(null);

	const openDialog = (featureData?: any) => {
		console.log(featureData);
		setEditingFeature(featureData || null);
		setOpen(true);
	};

	const handleCancel = () => {
		drawnItemsRef.current?.clearLayers();
		setOpen(false);
	};

	const handleSave = async (data: any) => {
		console.log(Object.fromEntries(data));
		setLoading(true);



		if (data.get("id") !== null && data.get("id") !== "") {
			if (!editingLayerRef.current) return;

			const layer = editingLayerRef.current;
			layer.setStyle(JSON.parse(data.get("style")));
			
			const res = await featuresApi.updateAttributes(
				data.get("id"),
				data,
			);


			console.log("UPDATED", res?.data);
		} else {
			const geojson = drawnItemsRef.current?.toGeoJSON();

			L.geoJSON(geojson, {
				style: JSON.parse(data.get("style")),
				pointToLayer: (feature: any, latlng: L.LatLngExpression) => {
					return L.circleMarker(
						latlng,
						feature.properties?.style || {},
					);
				},
				onEachFeature: (_feature, layer) => {
					djangoItemsRef.current?.addLayer(layer);
				},
			});

			drawnItemsRef.current?.clearLayers();
			data.append(
				"geom",
				JSON.stringify((geojson as any).features[0].geometry),
			);

			localStorage.setItem("savedStyles", data.get("style"));
			const res = await featuresApi.saveFeature(data);

			console.log("SAVED", res);
		}

		setLoading(false);
		setOpen(false);
		toast.success("Saved!");
	};

	const handleCancelEdits = () => {
		if (!editingLayerRef.current) return;
		const layer = editingLayerRef.current as any;

		console.log("LAYER", layer);

		const original = layer._originalGeoJSON;
		console.log("original", original);

		console.log(original.geometry.coordinates);

		const restored = L.geoJSON(original).getLayers()[0] as any;
		layer.editing?.disable();
		if (restored) {
			if (layer.setLatLngs) {
				layer.setLatLngs(restored.getLatLngs());
			} else if (layer.setLatLng) {
				layer.setLatLng(restored.getLatLng());
			}
		}
		layer.editing?.enable();
		layer.editing?.disable();

		delete layer._originalGeoJSON;

		editingLayerRef.current = null;
		setEditingLayer(null);
	};

	const handleSaveEdits = async () => {
		setLoading(true);
		if (!editingLayerRef.current) return;

		const edited = editingLayerRef.current;

		const geojson = edited.toGeoJSON();
		const id = edited.feature.id;

		console.log(geojson.geometry);

		const res = await featuresApi.updateGeometry(id, geojson.geometry);

		if (!res?.success) toast.error("Error", res?.error as any);

		setLoading(false);
		toast.success("Geometry updated!");
		editingLayerRef.current = null;
		setEditingLayer(null);
		edited.editing.disable();
	};

	const handleSearch = (keyword: string) => {
		let results: any = [];

		setShowResults(true);

		if (keyword.length > 0) {
			setSearchKeyword(keyword);
			results = features.filter((feature: any) =>
				feature.searchString.toLowerCase().includes(keyword.toLowerCase()),
			);
		} else {
			setSearchKeyword("");
		}

		console.log(features);
		console.log(results);
		setSearchResults(results);
	};

	const handleSearchClick = (id: number) => {
		let foundLayer: any = null;
		console.log(typeof id);

		djangoItemsRef.current?.eachLayer((layer: any) => {
			if (layer.feature?.id === id) {
				foundLayer = layer;
				if (foundLayer.feature.geometry.type !== "Point") {
					map?.fitBounds(foundLayer.getBounds());
				} else {
					map?.setView(foundLayer.getLatLng(), 16);
				}
			}
		});

		setShowResults(false);
	};

	return (
		<div className="w-full h-screen relative">
			<MapContainer
				center={center}
				zoom={zoom}
				zoomControl={false}
				style={{ height: "100%", width: "100%" }}
			>
				<MapController setMap={setMap} />
				<div className="absolute top-2 left-1/2 -translate-x-1/2 sm:w-100 w-65 z-999 flex flex-col">
					<div className="input relative">
						{searchKeyword !== "" && (
							<button
								className="absolute right-2 top-1/2 -translate-y-1/2"
								onClick={() => {
									setSearchKeyword("");
									setSearchResults([]);
								}}
							>
								<X size={16} />
							</button>
						)}
						<Input
							type="text"
							placeholder="Search..."
							className="rounded-full bg-white "
							value={searchKeyword}
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</div>

					{searchKeyword !== "" &&
						(searchResults.length > 0 ? (
							<div
								className=" bg-white mt-1 max-h-75 overflow-auto rounded-md"
								hidden={!showResults}
							>
								<ul>
									{searchResults.map((item: any) => (
										<li
											key={item.id}
											className="px-3 py-4 hover:bg-gray-200 cursor-pointer border-b border-gray-300"
											onClick={() =>
												handleSearchClick(item.id)
											}
										>
											<span className="text-lg font-bold">
												{item.name}
											</span>{" "}
											<span>({item.type})</span>
											<br />
											<span className="text-sm text-gray-500 italic">
												{item.notes}
											</span>
										</li>
									))}
								</ul>
							</div>
						) : (
							<div className="bg-white p-5 mt-1 rounded-md">
								<span className="text-red-400">
									'{searchKeyword}' not found.
								</span>
							</div>
						))}
				</div>
				<ResizeMap isSidebarOpen={isSidebarOpen} />
				<MapEvents />

				{loading && (
					<div className="absolute inset-0 z-9999 flex items-center justify-center bg-black/40">
						<span className="text-white text-lg">Loading ...</span>
					</div>
				)}

				<FeatureLoader
					setFeatures={setFeatures}
					setLoading={setLoading}
					djangoItemsRef={djangoItemsRef}
					editingLayerRef={editingLayerRef}
					setEditingLayer={setEditingLayer}
					openDialog={openDialog}
				/>

				{editingLayer && (
					<div className="absolute right-2 top-16 z-9999 flex flex-col gap-1">
						<button
							className=" bg-green-200/90 p-2 rounded-md cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
							onClick={handleSaveEdits}
						>
							<Check className="transition-transform duration-300 group-hover:scale-130 -disabled:active:text-red-700 " />
						</button>

						<button
							className=" bg-red-200/90 p-2 rounded-md cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
							onClick={handleCancelEdits}
						>
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

						<BaseLayer
							checked={defaultBase === "ESRI World Imagery"}
							name="ESRI World Imagery"
						>
							<TileLayer
								attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
								url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
							/>
						</BaseLayer>

						<FeatureGroup ref={drawnItemsRef} />
						<FeatureGroup ref={djangoItemsRef} />
					</LayersControl>
				</div>
				<ActionBar
					refs={refs}
					openDialog={openDialog}
					editingLayer={editingLayer}
					editingLayerRef={editingLayerRef}
					setEditingLayer={setEditingLayer}
				/>
			</MapContainer>
			<FeatureDialog
				open={open}
				setOpen={setOpen}
				onCancel={handleCancel}
				onSave={handleSave}
				featureData={editingFeature}
			/>
		</div>
	);
};

export default Map;
