import { useMap } from "react-leaflet";
import featuresApi from "@/services/api/features";
import { useEffect, useRef } from "react";
import L from "leaflet";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const FeatureLoader = ({
	djangoItemsRef,
	editingLayerRef,
	setEditingLayer,
	setLoading,
}: any) => {
	const map = useMap();
	const hasLoaded = useRef(false);

	useEffect(() => {
		if (!map || !djangoItemsRef.current) return;
		if (hasLoaded.current) return; // prevent multiple loads
		hasLoaded.current = true;

		const loadFeatures = async () => {
			setLoading(true);
			const data = await featuresApi.fetchAll();

			if (data) {
				console.log("Data fetched! Loading...");

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
	}, [djangoItemsRef]);

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
		
		setLoading(true);
		const featureId = feature.id;

		const res = await featuresApi.deleteFeature(featureId);

		console.log(res);
		setLoading(false);
		if (res?.success) {
			djangoItemsRef.current?.removeLayer(layer);
			toast.success("Feature deleted!");
		} else {
			toast.error(res?.error);
			console.error("Error deleting feature:", res?.error);
		}

	};

	return null;
};

export default FeatureLoader;
