import {
	MapContainer,
	TileLayer,
	LayersControl,
	FeatureGroup,
} from "react-leaflet";
import ActionBar from "./ActionBar";
import { useRef, useState, useEffect } from "react";
import FeatureDialog from "./FeatureDialog";
import L from "leaflet";
import "leaflet-draw";
import { toast } from "react-toastify";
import featuresApi from "@/services/api/features";
import { LogOut, Check, Ban } from "lucide-react";
const { BaseLayer, Overlay } = LayersControl;
import auth from "@/services/api/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Map = () => {
	const navigate = useNavigate();

	const center: [number, number] = [10.493574598800125, 123.41472829999998];
	const savedItemsRef = useRef<L.FeatureGroup | null>(null);
	const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
	const djangoItemsRef = useRef<L.FeatureGroup | null>(null);

	const [loading, setLoading] = useState(true);
	const [editingLayer, setEditingLayer] = useState<any>(null);

	const refs = {
		savedItemsRef: savedItemsRef,
		drawnItemsRef: drawnItemsRef,
		djangoItemsRef: djangoItemsRef,
	};
	const editingLayerRef = useRef<any>(null);


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

	useEffect(() => {
		const loadFeatures = async () => {

			const data = await featuresApi.fetchAll();

			if (data) {
				console.log("Data fetched! Loading...")
				console.log("LAYERS BEFORE:", djangoItemsRef.current);
				
				L.geoJSON(data as any, {
					style: (feature: any) => {
						return feature.properties?.style || {};
					},
					pointToLayer: (
						feature: any,
						latlng: L.LatLngExpression,
					) => {
						return L.circleMarker(
							latlng,
							feature.properties?.style || {},
						);
					},
					onEachFeature: (_feature, layer) => {
						// *******************************
						// * FOR MAP BOX GEOJSON STYLING *
						// *******************************
						const style = _feature.properties.style;
						_feature.properties["stroke"] = style.color;
						_feature.properties["stroke-width"] = style.weight;
						_feature.properties["fill"] = style.fillColor;
						_feature.properties["fill-opacity"] = style.fillOpacity;

						const popupContent = `
							<div class="feature-popup-content">
								<div>
									<table class="popup-content-table">
										<tr>
											<th>ID</th>
											<td>${_feature.id}</td>
										</tr>
										<tr>
											<th>Name</th>
											<td>${_feature.properties.name}</td>
										</tr>
										<tr>
											<th>Notes</th>
											<td>${_feature.properties.notes}</td>
										</tr>
										<tr>
											<th>Created By</th>
											<td>${_feature.properties.created_by}</td>
										</tr>
										<tr>
											<th>Created At</th>
											<td>${_feature.properties.created_at}</td>
										</tr>
									</table>
								</div>
								<div class="controls">
									<button class="edit">Edit Geometry</button>
									<button class="delete">Delete</button>
								</div>
							</div>

						`;
						layer.bindPopup(popupContent);

						layer.on("popupopen", () => {
							const popupEl = layer.getPopup()?.getElement();
							if (!popupEl) return;

							const deleteBtn = popupEl.querySelector(".delete");
							deleteBtn?.addEventListener("click", () => {
								console.log("Delete clicked!");
								handleDelete(_feature, layer);
							});

							const editBtn = popupEl.querySelector(".edit");
							editBtn?.addEventListener("click", () => {
								const editable = layer as any;

								editable._originalGeoJSON =
									editable.toGeoJSON();

								if (
									editingLayerRef.current &&
									editingLayerRef.current !== editable
								) {
									editingLayerRef.current.editing?.disable();
								}

								editable.editing?.enable();

								editingLayerRef.current = editable;
								setEditingLayer(editable);

								layer.closePopup();
							});
						});

						djangoItemsRef.current?.addLayer(layer);
						console.log("EACHLAYER", djangoItemsRef.current);
					},
				});

				console.log("LAYERS AFTER:", djangoItemsRef.current?.getLayers().length);
				djangoItemsRef.current?.eachLayer((layer) => {
					console.log(layer);
				})
			}

			setLoading(false);
		};

		loadFeatures();
	}, []);

	const handleDelete = async (feature: any, layer: any) => {
		const result = await Swal.fire({
			title: "Delete feature?",
			text: "This action cannot be undone.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it",
			cancelButtonText: "Cancel",
		});

		if (!result.isConfirmed) return;

		const featureId = feature.id;

		const res = await featuresApi.deleteFeature(featureId);

		console.log(res);

		if (res?.success) {
			djangoItemsRef.current?.removeLayer(layer);
			toast.success("DELETED!");
		} else {
			toast.error(res?.error);
			console.error("Error deleting feature:", res?.error);
		}
	};

	const handleCancelEdits = () => {
		if (!editingLayerRef.current) return;

		const layer = editingLayerRef.current as any;

		const original = layer._originalGeoJSON;

		console.log(original.geometry.coordinates);

		const restored = L.geoJSON(original).getLayers()[0] as any;
		layer.editing?.disable();
		if (restored) {
			if (layer.setLatLngs) {
				layer.setLatLngs(restored.getLatLngs());
				// layer.editing.latlngs = restored.getLatLngs();
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
		if (!editingLayerRef.current) return;

		const edited = editingLayerRef.current;

		const geojson = edited.toGeoJSON();
		const id = edited.feature.id;

		console.log(geojson.geometry);

		const res = await featuresApi.updateGeometry(id, geojson.geometry);

		if (!res?.success) toast.error("Error", res?.error as any);

		toast.success("Geometry updated");
		editingLayerRef.current = null;
		setEditingLayer(null);
		edited.editing.disable();
	};

	if (loading) return <div>Loading...</div>;


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
					onClick={handleSaveEdits}>
						<Check className="transition-transform duration-300 group-hover:scale-130 -disabled:active:text-red-700 " />
					</button>

					<button className=" bg-red-200/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
					onClick={handleCancelEdits}>
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
