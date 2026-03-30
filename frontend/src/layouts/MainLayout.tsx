import { Outlet } from "react-router-dom";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect, useState } from "react";

const MainLayout = () => {
	const [loggingOut, setLoggingOut] = useState(false);

	return (
		<SidebarProvider>
			<LayoutContent
				loggingOut={loggingOut}
				setLoggingOut={setLoggingOut}
			/>
		</SidebarProvider>
	);
};

function LayoutContent({ loggingOut, setLoggingOut }: any) {
	const { open, setOpen, setOpenMobile } = useSidebar();

	useEffect(() => {
		const sidebarStatus = localStorage.getItem("sidebarOpen");
		setOpen(sidebarStatus === "true");
	}, []);

	const handleCollapse = () => {
		localStorage.setItem("sidebarOpen", String(!open));
	}

	return (
		<>
			<AppSidebar setLoggingOut={setLoggingOut} setOpenMobile={setOpenMobile} handleCollapse={handleCollapse}/>
			<SidebarInset className="z-0">
				<main className="w-full overflow-hidden relative">
					<SidebarTrigger className="absolute top-1 left-1 z-990 bg-white" onClick={handleCollapse}/>
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
		</>
	);
}

export default MainLayout;
