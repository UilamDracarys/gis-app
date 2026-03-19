import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import auth from "@/services/api/auth";
import type { User } from "@/types/auth";

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		auth.getUser().then((data) => {
			setUser(data);
			setLoading(false);
		});
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};