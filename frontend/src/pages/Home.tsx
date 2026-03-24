import Map from "../components/Map";
import { toast, ToastContainer } from "react-toastify";
import featuresApi from "@/services/api/features";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import Swal from "sweetalert2";

const Home = () => {
	const [loading, setLoading] = useState(true);
	const djangoItemsRef = useRef<L.FeatureGroup | null>(null);
	const [editingLayer, setEditingLayer] = useState<any>(null);
	const editingLayerRef = useRef<any>(null);

	useEffect(() => {
		const loadFeatures = async () => {
			const data = await featuresApi.fetchAll();

			if (data) {
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
					},
				});
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
		<>
			<Map
				djangoItemsRef={djangoItemsRef}
				editingLayer={editingLayer}
				onSaveEdits={handleSaveEdits}
				onCancelEdits={handleCancelEdits}
			/>
			<ToastContainer />
		</>
	);
};

export default Home;
