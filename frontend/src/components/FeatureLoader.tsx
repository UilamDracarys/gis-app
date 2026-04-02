import { useMap } from "react-leaflet";
import featuresApi from "@/services/api/features";
import { useEffect, useRef } from "react";
import L from "leaflet";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

const FeatureLoader = ({
	setFeatures,
	djangoItemsRef,
	editingLayerRef,
	setEditingLayer,
	setLoading,
	openDialog,
}: any) => {
	const map = useMap();
	const hasLoaded = useRef(false);
	const { user } = useAuth();
	const username = user?.username;

	useEffect(() => {
		if (!map || !djangoItemsRef.current) return;
		if (hasLoaded.current) return; // prevent multiple loads
		hasLoaded.current = true;
		const features: any = [];

		const loadFeatures = async () => {
			setLoading(true);
			const data = await featuresApi.fetchAll();
			console.log("data", data);

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
							visibility: _feature.properties.visibility,
						};

						const createdBy =
							_feature.properties.created_by === username
								? "You"
								: _feature.properties.created_by;

						const searchData = {
							id: _feature.id,
							name: _feature.properties.name,
							notes: _feature.properties.notes,
							type: _feature.geometry.type,
							searchString:
								_feature.id +
								_feature.properties.name +
								_feature.properties.notes,
						};

						features.push(searchData);

						const actions =
							createdBy === "You"
								? `<div class="controls flex gap-1 mt-3 justify-center w-auto">
									<button class="edit-att hover:font-bold active:border active:border-green-600 p-2 rounded-md cursor-pointer bg-green-300 hover:bg-green-100 flex justify-center items-center" title="Edit Attributes">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
									</button>
									<button class="edit hover:font-bold active:border active:border-orange-600 p-2 rounded-md cursor-pointer bg-orange-300 hover:bg-orange-100 flex justify-center items-center" title="Edit Geometry">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-vector-square-icon lucide-vector-square"><path d="M19.5 7a24 24 0 0 1 0 10"/><path d="M4.5 7a24 24 0 0 0 0 10"/><path d="M7 19.5a24 24 0 0 0 10 0"/><path d="M7 4.5a24 24 0 0 1 10 0"/><rect x="17" y="17" width="5" height="5" rx="1"/><rect x="17" y="2" width="5" height="5" rx="1"/><rect x="2" y="17" width="5" height="5" rx="1"/><rect x="2" y="2" width="5" height="5" rx="1"/></svg>
									</button>
									<button class="delete hover:font-bold active:border active:border-red-600 p-2 rounded-md cursor-pointer bg-red-300 hover:bg-red-100 flex justify-center items-center" title="Delete Feature">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
									</button>
								</div>`
								: ``;

						const popupContent2 = `
							<div class="text-center">
							<h2 class="font-bold text-lg text-center">${featureData.name}</h2>
							${measure ? `<h2 class="mb-2 font-bold text-md text-center ">${measure.toFixed(2)} ${measureUnit}</h2>` : ""}
							<p class="italic text-gray-500">${featureData.notes}</p>
							<span>${_feature.properties.created_by}</span><br/>
							<span class="text-gray-500">${new Date(_feature.properties.created_at).toLocaleString()}</span>
							${actions}
							</div>
						`;

						// const popupContent = `
						// 	<div class="feature-popup-content">
						// 		<div>
						// 			<table class="popup-content-table">
						// 				<tr>
						// 					<th>ID</th>
						// 					<td>${featureData.id}</td>
						// 				</tr>
						// 				<tr>
						// 					<th>Name</th>
						// 					<td>${featureData.name}</td>
						// 				</tr>
						// 				<tr>
						// 					<th>Measure</th>
						// 					<td>${measure?.toFixed(2)} ${measureUnit}</td>
						// 				</tr>
						// 				<tr>
						// 					<th>Notes</th>
						// 					<td>${featureData.notes.length > 30 ? featureData.notes.slice(0, 30).concat("...") : featureData.notes}</td>
						// 				</tr>
						// 				<tr>
						// 					<th>Created By</th>
						// 					<td>${createdBy}</td>
						// 				</tr>
						// 				<tr>
						// 					<th>Created At</th>
						// 					<td>${new Date(_feature.properties.created_at).toLocaleString()}</td>
						// 				</tr>
						// 			</table>
						// 		</div>
						// 		${actions}
						// 	</div>

						// `;
						layer.bindPopup(popupContent2);

						layer.on("popupopen", () => {
							const popupEl = layer.getPopup()?.getElement();
							if (!popupEl) return;

							const editAttBtn =
								popupEl.querySelector(".edit-att");
							editAttBtn?.addEventListener("click", () => {
								const editable = layer as any;

								editingLayerRef.current = editable;
								openDialog(featureData);
								layer.closePopup();
							});

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

			setFeatures(features);
			setLoading(false);
		};
		loadFeatures();
	}, [djangoItemsRef]);

	const handleDelete = async (feature: any, layer: any) => {
		const result = await Swal.fire({
			title: "Delete feature?",
			text: "This action cannot be undone.",
			icon: "warning",
			customClass: {
				popup: "!rounded-2xl !p-6 !w-auto",
				title: "!text-2xl !font-bold",
				confirmButton:
					"cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded",
				actions: "gap-2",
				cancelButton:
					"cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded",
			},
			buttonsStyling: false,
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
