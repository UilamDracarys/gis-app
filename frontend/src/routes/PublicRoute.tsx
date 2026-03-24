import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicRoute({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) return null;

	if (user) return <Navigate to="/" replace/>;

	return <>{children}</>;
}