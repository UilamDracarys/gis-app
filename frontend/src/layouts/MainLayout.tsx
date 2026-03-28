import { Outlet } from "react-router-dom";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState } from "react";

const MainLayout = () => {
	const [loggingOut, setLoggingOut] = useState(false);

	const handleCollapse = () => {
		console.log("isSidebarOpen", !open);
		localStorage.setItem("sidebarOpen", JSON.stringify(!open));
	};

	return (
		<SidebarProvider>
			<AppSidebar
				setLoggingOut={setLoggingOut}
				handleCollapse={handleCollapse}
			/>
			<LayoutContent
				loggingOut={loggingOut}
				handleCollapse={handleCollapse}
			/>
		</SidebarProvider>
	);
};

function LayoutContent({ loggingOut, handleCollapse }: any) {

	return (
		<SidebarInset className="z-0">
			<main className="w-full rounded-l-2xl overflow-hidden relative">
				<SidebarTrigger
					onClick={handleCollapse}
					className="absolute top-1 left-1 z-990 bg-white"
				/>
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
