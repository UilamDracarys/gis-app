import client from "./client";
import type { User, AuthResponse } from "@/types/auth";

const auth = {
	async getUser(): Promise<User | null> {
		try {
			const res = await client.get<User>("/auth/user/");
			return res.data;
		} catch {
			return null;
		}
	},

	async login(username: string, password: string): Promise<AuthResponse> {
		try {
			await client.post("/auth/token/", { username, password });
			return { success: true };
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
};

export default auth;