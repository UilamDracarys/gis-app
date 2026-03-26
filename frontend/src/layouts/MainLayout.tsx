import { Outlet } from "react-router-dom";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState } from "react";

const MainLayout = () => {
	const [loggingOut, setLoggingOut] = useState(false);

	return (
		<SidebarProvider>
			<AppSidebar setLoggingOut={setLoggingOut} />
			<LayoutContent loggingOut={loggingOut} />
		</SidebarProvider>
	);
};

function LayoutContent({ loggingOut }: any) {
	const { open: isSidebarOpen } = useSidebar();

	const handleCollapse = () => {
		console.log(!isSidebarOpen);
		localStorage.setItem("sidebarOpen", JSON.stringify(!isSidebarOpen));
	};

	return (
		<SidebarInset className="relative">
			<SidebarTrigger
				onClick={handleCollapse}
				className="absolute top-1 left-1 z-999 bg-white"
			/>
			<main className="w-full rounded-l-2xl overflow-hidden">
				{loggingOut && (
					<div className="absolute inset-0 z-9999 flex items-center justify-center bg-black/40">
						<span className="text-white text-lg">
							Logging you out...
						</span>
					</div>
				)}
				<Outlet />
			</main>
		</SidebarInset>
	);
}

export default MainLayout;
