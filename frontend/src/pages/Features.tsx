import featuresApi from "@/services/api/features";
import { useEffect, useState } from "react";
import { Loader, Sheet } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const Features = () => {
	const [features, setFeatures] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const loadFeatures = async () => {
			const featureCollection: any = await featuresApi.fetchAll();
			setFeatures(featureCollection.features);
			setLoading(false);
		};
		loadFeatures();
	}, []);

	return (
		<div className="h-screen w-full py-5 px-4">
			<h1 className="text-2xl font-bold  mt-5 flex gap-2 items-center">
				<Sheet />
				Features</h1>
			<div className="border rounded-lg p-4 mt-3 overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Measure</TableHead>
							<TableHead>Unit</TableHead>
							<TableHead>Notes</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="p-3 bg-gray-100"
								>
									<div className="flex items-center justify-center">
										<Loader className="animate-spin" />
									</div>
								</TableCell>
							</TableRow>
						)}

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
								<TableRow
									key={index}
									className="odd:bg-gray-100"
								>
									<TableCell>{feature.id}</TableCell>
									<TableCell className="p-3">
										{feature.geometry.type}
									</TableCell>
									<TableCell className="p-3 font-bold">
										{feature.properties.name}
									</TableCell>
									<TableCell className="p-3 text-right">
										{measure?.toFixed(2)}
									</TableCell>
									<TableCell className="p-3">
										{measureUnit}
									</TableCell>
									<TableCell className="p-3">
										{feature.properties.notes}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default Features;
