import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) return <Loading />;

	if (!user) return <Navigate to="/login" replace/>;

	return <>{children}</>;
}