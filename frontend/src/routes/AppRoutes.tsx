import { Route, createRoutesFromElements } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoutes";
import Register from "@/pages/Register";
import PublicRoute from "./PublicRoute";
import Features from "@/pages/Features";
import Settings from "@/pages/Settings";
import ChangePassword from "@/pages/ChangePassword";
import ResetPassword from "@/pages/ResetPassword";
import { ToastContainer } from "react-toastify";

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
		<Route path="/reset-password" element={
				<PublicRoute>
					<ResetPassword />
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
			<Route path="/features" element={<Features />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/change-password" element={<ChangePassword />} />
		</Route>


	</>
);
