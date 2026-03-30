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
			console.log(Object.fromEntries(data));
			
			const res = await client.post("/features/", data);
			
			if (res.status != 200) {
				return { success: false };
			}
			return { success: true, data: res.data };
		} catch (error: any) {
			console.error(error.message);
		}
	},
	async deleteFeature(id: any) {
		try {
			const res = await client.delete(`/features/${id}/`);
			console.log("RESPONSE", res);
			if (res.status !== 204) {
				return { error: res.statusText }
			}
			return {success: true};
		} catch (error: any) {
			console.error(error.message);
		}
	},
	async updateAttributes(id: any, data: any) {

		try {
			console.log(data.get("style"));

			const res = await client.patch(`/features/${id}/`, {
				name: data.get("name"),
				notes: data.get("notes"),
				style: JSON.parse(data.get("style")),
			})

			console.log(res)

			return { success: true, data: res.data};
		} catch(error: any) {
			console.error(error.message);
		}
	},
	async updateGeometry(id: any, geometry: any) {
		try {
			const res = await client.patch(`/features/${id}/`, {geom: geometry});
			if (res.status !== 200) {
				return { error: res.statusText }
			}
			return {success: true};
		} catch (error: any) {
			console.error(error.message)
		}
	}
};

export default featuresApi;
