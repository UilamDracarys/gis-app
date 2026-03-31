import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
	const router = createBrowserRouter(routes);
	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer />
		</>
	);
}

export default App;
