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
	openDialog,
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

						const measureType = _feature.properties.measure?.type;
						const measure =
							measureType == "length"
								? _feature.properties.measure?.value > 1000
									? _feature.properties.measure?.value / 1000
									: _feature.properties.measure?.value
								: _feature.properties.measure?.value > 10000
									? _feature.properties.measure?.value / 10000
									: _feature.properties.measure?.value;

						const measureUnit =
							measureType == "length"
								? _feature.properties.measure?.value > 1000
									? "Km"
									: "m"
								: _feature.properties.measure?.value > 10000
									? "ha"
									: _feature.properties.measure?.value ===
										  undefined
										? ""
										: "sqm";

						const featureData = {
							id: _feature.id,
							name: _feature.properties.name,
							notes: _feature.properties.notes,
							style: _feature.properties.style,
						}


						const popupContent = `
							<div class="feature-popup-content">
								<div>
									<table class="popup-content-table">
										<tr>
											<th>ID</th>
											<td>${featureData.id}</td>
										</tr>
										<tr>
											<th>Name</th>
											<td>${featureData.name}</td>
										</tr>
										<tr>
											<th>Measure</th>
											<td>${measure?.toFixed(2)} ${measureUnit}</td>
										</tr>
										<tr>
											<th>Notes</th>
											<td>${featureData.notes}</td>
										</tr>
										<tr>
											<th>Created By</th>
											<td>${_feature.properties.created_by}</td>
										</tr>
										<tr>
											<th>Created At</th>
											<td>${new Date(_feature.properties.created_at).toLocaleString()}</td>
										</tr>
									</table>
								</div>
								<div class="controls grid grid-cols-3 gap-1 mt-2">
									<button class="edit-att hover:font-bold active:border active:border-green-600 p-2 rounded-md cursor-pointer bg-green-300 hover:bg-green-100">Edit Attributes</button>
									<button class="edit hover:font-bold active:border active:border-orange-600 p-2 rounded-md cursor-pointer bg-orange-300 hover:bg-orange-100">Edit Geometry</button>
									<button class="delete hover:font-bold active:border active:border-red-600 p-2 rounded-md cursor-pointer bg-red-300 hover:bg-red-100" >Delete</button>
								</div>
							</div>

						`;
						layer.bindPopup(popupContent);

						layer.on("popupopen", () => {
							const popupEl = layer.getPopup()?.getElement();
							if (!popupEl) return;


							const editAttBtn = popupEl.querySelector(".edit-att");
							editAttBtn?.addEventListener("click", () => {

								const editable = layer as any;
								
								editingLayerRef.current = editable;
								openDialog(featureData);
								layer.closePopup();
							})

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

								const vertexIcon = new L.DivIcon({
									className: "",
									iconSize: [20, 20],
									iconAnchor: [10, 10],
									html: '<div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>',
								});

								if (editable.editing?.options) {
									editable.editing.options.icon = vertexIcon;
									editable.editing.options.touchIcon = vertexIcon;
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
