import client, { setAccessToken } from "./client";
import type { User, AuthResponse } from "@/types/auth";

const auth = {
	async getUser(): Promise<User | null> {
		try {
			const res = await client.get<User>("/auth/user/");
			return res.data;
		} catch (error: any) {
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

			setAccessToken(res.data.access);

			console.log("AUTH TS RES", res);
			if (res.status == 200) {
				return { success: true };
			} else {
				console.log(res.statusText);
				return { error: res.statusText };
			}
		} catch (error: any) {
			console.log("ERROR", error);
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
			setAccessToken(null);
			return { success: true };
		} catch {
			setAccessToken(null);
			return { error: "Logout failed" };
		}
	},

	async register(payload: any) {
		try {
			const res = await client.post("/auth/register/", payload);
			console.log(res);
			setAccessToken(res.data.access);
			return res.data;
		} catch (error: any) {
			console.error("ERROR REGISTERING:", error.message || error);
		}
	},
	async changePassword(old_password: any, new_password: any) {
		try {
			const res = await client.post("/auth/change-password/", {
				old_password,
				new_password,
			});
			return {
				success: true,
				data: res.data,
			};
		} catch (err: any) {
			return {
				success: false,
				error: err.response?.data || { detail: "Something went wrong" },
				status: err.response?.status,
			};
		}
	},
};

export default auth;
