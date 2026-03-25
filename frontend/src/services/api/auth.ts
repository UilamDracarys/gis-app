import client from "./client";
import type { User, AuthResponse } from "@/types/auth";

const auth = {
	async getUser(): Promise<User | null> {
		try {
			const res = await client.get<User>("/auth/user/");
			console.log("USER", res.data);
			return res.data;
		} catch(error: any) {
			console.error("GET USER ERROR:", error.response || error);
			return null;
		}
	},

	async login(username: string, password: string): Promise<AuthResponse> {
		try {

			console.log("LOGIN AUTH TS");

			const res = await client.post("/auth/token/", {
				username,
				password,
			});
			
			console.log("AUTH TS RES", res)
			if (res.status == 200) {
				return { success: true };
			} else {
				console.log(res.statusText);
				return { error: res.statusText };
			}
		} catch (error: any) {
			return {
				error:
					error.response?.data?.detail ||
					error.message ||
					"Login failed",
			};
		}
	},

	async logout(): Promise<AuthResponse> {
		try {
			await client.post("/auth/logout/");
			return { success: true };
		} catch {
			return { error: "Logout failed" };
		}
	},

	async register(payload: any) {
		try {
			const res = await client.post("/auth/register/", payload);
			console.log(res)
			
			return res.data;


		} catch(error: any) {
			console.error("ERROR REGISTERING:", error.message || error);
			
		}
	}

};

export default auth;
