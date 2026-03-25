import { Route, createRoutesFromElements } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoutes";
import Register from "@/pages/Register";
import PublicRoute from "./PublicRoute";

export const routes = createRoutesFromElements(
	<>
		<Route
			path="/login"
			element={
				<PublicRoute>
					<Login />
				</PublicRoute>
			}
		/>
		<Route path="/register" element={
				<PublicRoute>
					<Register />
				</PublicRoute>
			} />
		<Route
			path="/"
			element={
				<ProtectedRoute>
					<MainLayout />
				</ProtectedRoute>
			}
		>
			<Route index element={<Home />} />
		</Route>
	</>
);
