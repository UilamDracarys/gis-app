import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
const isLocalhost = window.location.hostname === "localhost";
// simple in-memory token — no store needed
let _accessToken: string | null = null;
export const getAccessToken = () => _accessToken;
export const setAccessToken = (token: string | null) => { _accessToken = token; };


console.log("ISLOCALHOST", isLocalhost)

const API_URL = isLocalhost ? "http://localhost:8000/api" : import.meta.env.VITE_DJANGO_BACKEND_API_URL as string;

const client = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

const PUBLIC_ROUTES = ["/login", "/register"];

// Change access token request
client.interceptors.request.use((config) => {
	const token = getAccessToken();
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
})

client.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const original = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !original._retry && !original.url?.includes("/auth/token/")) {
			original._retry = true;

			if (!isRefreshing) {
				isRefreshing = true;

				try {

					// Read access token from response body
					const { data } = await client.post("/auth/token/refresh/");

					// Save to memory
					setAccessToken(data.access);
					processQueue(data.access);

					// Attached to request
					original.headers.Authorization = `Bearer ${data.access}`;
					// isRefreshing = false;
					return client(original);
				} catch (refreshError) {
					// isRefreshing = false; --> Move to finally clause
					processQueue(refreshError, null);
					setAccessToken(null);

					
					console.log("LOGIN");
					const currentPath = window.location.pathname;
					if (!PUBLIC_ROUTES.includes(currentPath)) {
						window.location.href = "/login";
					}

					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			}
		}

		return Promise.reject(error);
	},
);

export default client;
