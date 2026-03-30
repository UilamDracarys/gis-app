import featuresApi from "@/services/api/features";
import { useEffect, useState } from "react";

const Features = () => {
	const [features, setFeatures] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const loadFeatures = async () => {
			const featureCollection: any = await featuresApi.fetchAll();
			setFeatures(featureCollection.features);
		};
		loadFeatures();
		setLoading(false);
	}, []);

	return (
		<div className="h-screen w-full py-5 px-4">
			{loading && <div>Loading...</div>}

			<h1 className="text-2xl font-bold  mt-5 ">Features</h1>
			<div className="border rounded-lg p-4 mt-3 overflow-auto">
				<table className="w-full border">
					<thead className="border">
						<tr>
							<th className="p-3">ID</th>
							<th className="p-3">Type</th>
							<th className="p-3">Name</th>
							<th className="p-3">Measure</th>
							<th className="p-3">Unit</th>
							<th className="p-3">Notes</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{features.map((feature: any, index) => {
							const measureType =
								feature.properties.measure?.type;
							const measure =
								measureType == "length"
									? feature.properties.measure?.value > 1000
										? feature.properties.measure?.value /
											1000
										: feature.properties.measure?.value
									: feature.properties.measure?.value > 10000
										? feature.properties.measure?.value /
											10000
										: feature.properties.measure?.value;

							const measureUnit =
								measureType == "length"
									? feature.properties.measure?.value > 1000
										? "Km"
										: "m"
									: feature.properties.measure?.value > 10000
										? "ha"
										: feature.properties.measure?.value ===
											  undefined
											? ""
											: "sqm";

							return (
								<tr key={index} className="odd:bg-gray-100">
									<td className="p-3">{feature.id}</td>
									<td className="p-3">
										{feature.geometry.type}
									</td>
									<td className="p-3 font-bold">
										{feature.properties.name}
									</td>
									<td className="p-3 text-right">
										{measure?.toFixed(2)}
									</td>
									<td className="p-3">{measureUnit}</td>
									<td className="p-3">
										{feature.properties.notes}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Features;
