import {
	Hexagon,
	Waypoints,
	MapPin,
	Locate,
	Loader,
	BrushCleaning,
	FileText,
	Ban,
	Trash,
} from "lucide-react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const ActionBar = ({ refs, openDialog }: any) => {
	const { savedItemsRef, drawnItemsRef, djangoItemsRef } = refs;
	const map = useMap();
	const [clearDisabled, setClearDisabled] = useState(true);
	const [locateDisabled, setLocateDisabled] = useState(false);
	const [isDrawing, setIsDrawing] = useState(false);

	const [isCurrentLoading, setIsCurrentLoading] = useState(false);

	const curLocRef = useRef<L.FeatureGroup | null>(null);
	const actionBarRef = useRef<HTMLDivElement | null>(null);
	const drawerRef = useRef<L.Draw.Feature | null>(null);

	const [activeTool, setActiveTool] = useState("");

	useEffect(() => {
		if (actionBarRef.current) {
			L.DomEvent.disableClickPropagation(actionBarRef.current);
			L.DomEvent.disableScrollPropagation(actionBarRef.current);
		}
	}, []);

	useEffect(() => {
		curLocRef.current = new L.FeatureGroup();

		const saved = localStorage.getItem("features");

		if (saved) {
			const geojson = JSON.parse(saved);

			savedItemsRef.current.clearLayers();

			L.geoJSON(geojson, {
				style: (feature: any) => {
					return feature.properties?.style || {};
				},
				pointToLayer: (feature: any, latlng: L.LatLngExpression) => {
					return L.circleMarker(
						latlng,
						feature.properties?.style || {},
					);
				},
				onEachFeature: (_feature, layer) => {
					savedItemsRef.current?.addLayer(layer);
				},
			});
		}

		map.addLayer(curLocRef.current);

		const handleBaseLayerChange = (e: any) => {
			localStorage.setItem("basemap", e.name);
		};

		const handleDrawn = (event: any) => {
			openDialog();

			const layer = event.layer;
			layer.setStyle(
				featureStyles[event.layerType as keyof typeof featureStyles],
			);

			layer.feature = {
				type: "Feature",
				properties: {},
			};
			layer.feature.properties.style =
				featureStyles[event.layerType as keyof typeof featureStyles];


			drawnItemsRef.current?.addLayer(layer);
			setClearDisabled(false);
			setActiveTool("");
		};

		const rightClick = (event: any) => {
			toast.info(
				`Clicked at ${event.latlng.lat.toFixed(4)}, ${event.latlng.lng.toFixed(4)}`,
			);
		};

		const handleDeleted = (_event: any) => {
			
			const geojson = savedItemsRef.current?.toGeoJSON();
			localStorage.setItem("features", JSON.stringify(geojson));
		};

		map.on(L.Draw.Event.CREATED, handleDrawn);
		map.on("contextmenu", rightClick);
		map.on("baselayerchange", handleBaseLayerChange);

		const lyrs: string[] = [];

		map.eachLayer((layer) => {
			if (layer instanceof L.FeatureGroup) {
				const layerName = (layer as any).name;
				if (layerName) lyrs.push(layerName);
			}
		});


		return () => {
			map.off(L.Draw.Event.CREATED, handleDrawn);
			map.off(L.Draw.Event.DELETED, handleDeleted);
			map.off("contextmenu", rightClick);
			map.off("baselayerchange", handleBaseLayerChange);
		};
	}, [map]);

	const handleLocate = () => {
		setLocateDisabled(true);
		setIsCurrentLoading(true);

		if (!navigator.geolocation) {
			alert("Geolocation not supported");
			setIsCurrentLoading(false);
			setLocateDisabled(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				curLocRef.current?.clearLayers();
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				const latlng: [number, number] = [lat, lng];

				const blinkingIcon = L.divIcon({
					className: "",
					html: '<div class="blink-marker"></div>',
					iconSize: [18, 18],
				});

				const currentLocation = L.marker(latlng, {
					icon: blinkingIcon,
				});
				curLocRef.current?.addLayer(currentLocation);

				map.setView(latlng, 16);
				setIsCurrentLoading(false);
				setLocateDisabled(false);
			},

			(error) => {
				console.error(error);
				setIsCurrentLoading(false);
				setLocateDisabled(false);
			},
			{
				enableHighAccuracy: false,
				maximumAge: 60000,
			},
		);
	};

	const handleDraw = (featureType: string) => {
		let drawer;

		if (drawerRef.current) {
			drawerRef.current.disable();
		}

		if (featureType === activeTool) {
			setActiveTool("");
			setIsDrawing(false);
			drawerRef.current?.disable();
			return;
		} else {
			setActiveTool(featureType);
		}

		if (featureType == "Polygon") {
			drawer = new L.Draw.Polygon(map as any, {
				shapeOptions: featureStyles["polygon"],
			});
		} else if (featureType == "Polyline") {
			drawer = new L.Draw.Polyline(map as any, {
				shapeOptions: featureStyles["polyline"],
			});
		} else {
			drawer = new L.Draw.CircleMarker(map as any);
		}
		drawer.enable();
		setIsDrawing(true);
		drawerRef.current = drawer;
	};

	const clearDrawnItems = () => {

		drawnItemsRef.current?.clearLayers();
		setActiveTool("");
		setIsDrawing(false);
		setClearDisabled(true);
	};

	const handleDelete = () => {
		const deleteHandler = new L.EditToolbar.Delete(map as any, {
			featureGroup: savedItemsRef.current,
		});

		deleteHandler.enable();
	};

	const exportFeatureGroup = () => {
		const count = djangoItemsRef.current
			? djangoItemsRef.current.getLayers().length
			: 0;

		if (count == 0) {
			toast.error(
				"There are no features inside saved features. Please create and save some features first.",
			);
			return;
		}

		const geojson = djangoItemsRef.current.toGeoJSON();
		const text = JSON.stringify(geojson, null, 2);

		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = "features.geojson";
		link.click();

		URL.revokeObjectURL(url);
	};

	return (
		<div
			ref={actionBarRef}
			className="controls bg-white/60 z-9000 w-full h-15 absolute bottom-0 flex justify-center items-center "
		>
			<div className="bottom-right-buttons absolute bottom-[110%] right-1.25 z-9000 flex flex-col gap-1">
				<button
					onClick={handleLocate}
					disabled={locateDisabled}
					className="current-loc bg-white/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{isCurrentLoading ? (
						<Loader className="animate-spin" />
					) : (
						<Locate className="transition-transform duration-300 group-hover:scale-130 active:text-red-700" />
					)}
				</button>

				<button
					className="bg-white/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
					disabled={!isDrawing}
					onClick={() => {
						setIsDrawing(false);
						setActiveTool("");
						drawerRef.current?.disable();
					}}
				>
					<Ban className="transition-transform duration-300 -disabled:group-hover:scale-130 -disabled:active:text-red-700 " />
				</button>

				<button
					className="bg-white/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
					disabled={clearDisabled}
					onClick={clearDrawnItems}
				>
					<BrushCleaning className="transition-transform duration-300 -disabled:group-hover:scale-130 -disabled:active:text-red-700 " />
				</button>

				<button
					className="bg-white/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
					onClick={handleDelete}
				>
					<Trash className="transition-transform duration-300 -disabled:group-hover:scale-130 -disabled:active:text-red-700 " />
				</button>

				<button
					className="bg-white/90 p-3 rounded-full cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
					onClick={exportFeatureGroup}
				>
					<FileText className="transition-transform duration-300 -disabled:group-hover:scale-130 -disabled:active:text-red-700 " />
				</button>
			</div>

			<div className="font-jbm flex justify-center items-center gap-5">
				<button
					className={`cursor-pointer group flex flex-col justify-center items-center
                            ${activeTool === "Polygon" && "text-red-700 font-bold"}
                        `}
					onClick={() => handleDraw("Polygon")}
				>
					<Hexagon className="group-hover:scale-130 transition-scale ease duration-300 " />
					<p
						className="text-sm"
						style={{
							fontFamily: "JetBrains Mono",
						}}
					>
						Add Polygon
					</p>
				</button>
				<button
					className={`cursor-pointer group flex flex-col justify-center items-center
                            ${activeTool === "Polyline" && "text-red-700 font-bold"}
                        `}
					onClick={() => handleDraw("Polyline")}
				>
					<Waypoints className="group-hover:scale-130 transition-scale ease duration-300 " />
					<p className="text-sm group">Add Line</p>
				</button>
				<button
					className={`cursor-pointer group flex flex-col justify-center items-center
                            ${activeTool === "Marker" && "text-red-700 font-bold"}
                        `}
					onClick={() => handleDraw("Marker")}
				>
					<MapPin className="group-hover:scale-130 transition-scale ease duration-300 " />
					<p className="text-sm">Add Point</p>
				</button>
			</div>
		</div>
	);
};

const featureStyles = {
	polygon: {
		color: "red",
		weight: 3,
		fillColor: "red",
		fillOpacity: 0.2,
	},
	polyline: {
		color: "purple",
		weight: 3,
	},
	circlemarker: {
		weight: 2,
		color: "orange",
		fillColor: "yellow",
		fillOpacity: 1,
		radius: 8,
	},
};

export default ActionBar;
