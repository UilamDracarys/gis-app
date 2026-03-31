import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

export default function PublicRoute({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	
	if (loading) return <Loading />;

	if (user) return <Navigate to="/" replace/>;

	return <>{children}</>;
}