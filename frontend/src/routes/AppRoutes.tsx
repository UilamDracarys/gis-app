import { Route, createRoutesFromElements } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoutes";
import DialogTest from "@/pages/DialogTest";

export const routes = createRoutesFromElements(
	<>
		<Route path="/login" element={<Login />} />
		<Route path="/test" element={<DialogTest />} />
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
	</>,
);
