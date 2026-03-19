import Map from "../components/Map";
import { ToastContainer } from "react-toastify";
import featuresApi from "@/services/api/features";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";

const Home = () => {
	const [loading, setLoading] = useState(true);
	const djangoItemsRef = useRef<L.FeatureGroup | null>(null);

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

						djangoItemsRef.current?.addLayer(layer);
					},
				});
			}

			setLoading(false);
		};

		loadFeatures();
	}, []);

	if (loading) return <div>Loading...</div>;

	return (
		<>
			<Map djangoItemsRef={djangoItemsRef} />
			<ToastContainer />
		</>
	);
};

export default Home;
