import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { LogOut, Map, Sheet, Cog } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import auth from "@/services/api/auth";
import logo from "@/assets/logo.png";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function AppSidebar({ setLoggingOut, handleCollapse }: any) {
	const isMobile = useIsMobile();
	const { open, setOpen } = useSidebar();

	const navigate = useNavigate();
	const handleLogout = async () => {
		setLoggingOut(true);
		const res = await auth.logout();
		console.log("LOGOUT", res);
		navigate("/login");
		setLoggingOut(false);
	};

	useEffect(() => {
		console.log("APPSIDEBAR", open);
		console.log(
			"LOCALSTORAGE",
			localStorage.getItem("sidebarOpen") == "true",
		);
		console.log(isMobile);
		setOpen(localStorage.getItem("sidebarOpen") == "true");
	}, []);

	const { setOpenMobile } = useSidebar();
	const location = useLocation();

	useEffect(() => {
		setOpenMobile(false);
		console.log("PATH", location.pathname);
	}, [location.pathname, setOpenMobile]);

	return (
		<Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
			<SidebarHeader className="group flex flex-row justify-between">
				<div className="flex items-center gap-2 overflow-hidden">
					<img src={logo} alt="app logo" className="w-10 shrink-0" />
					<h2 className="font-bold text-2xl whitespace-nowrap group-data-[collapsed=true]:hidden">
						SimpleGIS
					</h2>
				</div>
				{isMobile && (
					<SidebarTrigger
						onClick={handleCollapse}
						className="z-999 bg-white"
					/>
				)}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className="cursor-pointer hover:font-bold py-5"
								asChild
							>
								<Link to="/">
									<Map className="scale-150" />
									<h3 className="text-lg ms-3">Map</h3>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton
								className="cursor-pointer hover:font-bold py-5"
								asChild
							>
								<Link to="/features">
									<Sheet className="scale-150" />
									<h3 className="text-lg ms-3">
										Features List
									</h3>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="cursor-pointer hover:font-bold"
							asChild
						>
							<Link to="/settings">
								<Cog className="scale-150" />
								<h3 className="text-md ms-2">Settings</h3>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="cursor-pointer hover:font-bold text-red-600 hover:text-red-600"
							onClick={handleLogout}
						>
							<LogOut className="scale-150" />
							<h3 className="text-md ms-2">Log Out</h3>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
