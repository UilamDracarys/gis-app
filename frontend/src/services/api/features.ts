import client from "./client";
import type { Feature } from "@/types/data";

const featuresApi = {
	async fetchAll(): Promise<Feature[] | null> {
		try {
			const res = await client.get("/features/");
			return res.data;
		} catch {
			return null;
		}
	},
	async saveFeature(data: any) {
		try {
			const res = await client.post("/features/", data);
			if (res.status != 200) {
				return { success: false };
			}
			return { success: true };
		} catch (error: any) {
			console.error(error.message);
		}
	},
};

export default featuresApi;
