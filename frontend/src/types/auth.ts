export interface User {
	id: number;
	username: string;
	email?: string;
	// add fields based on your Django serializer
}

export interface AuthResponse {
	success?: boolean;
	error?: string;
}