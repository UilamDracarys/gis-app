import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_DJANGO_BACKEND_API_URL as string;

const client = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

let isRefreshing = false;

client.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const original = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !original._retry) {
			original._retry = true;

			if (!isRefreshing) {
				isRefreshing = true;

				try {
					await client.post("/auth/token/refresh/");
					isRefreshing = false;
					return client(original);
				} catch {
					isRefreshing = false;
					window.location.href = "/auth/login";
				}
			}
		}

		return Promise.reject(error);
	}
);

export default client;