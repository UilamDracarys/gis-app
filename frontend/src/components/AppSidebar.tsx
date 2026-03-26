import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogOut, Map, Sheet, Cog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import auth from "@/services/api/auth";
import logo from "@/assets/logo.png";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function AppSidebar({ setLoggingOut }: any) {
	const { setOpen } = useSidebar();
	const isMobile = useIsMobile();

	const navigate = useNavigate();
	const handleLogout = async () => {
		setLoggingOut(true);
		const res = await auth.logout();
		console.log("LOGOUT", res);
		navigate("/login");
		setLoggingOut(false);
	};

	useEffect(() => {
		console.log(
			"LOCALSTORAGE",
			localStorage.getItem("sidebarOpen") == "true",
		);
		setOpen(localStorage.getItem("sidebarOpen") == "true");
	}, []);

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="group">
				<div className="flex items-center gap-2 overflow-hidden">
					<img src={logo} alt="app logo" className="w-10 shrink-0" />
					<h2 className="font-bold text-2xl whitespace-nowrap group-data-[collapsed=true]:hidden">
						SimpleGIS
					</h2>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<Link to="/">
								<SidebarMenuButton className="cursor-pointer hover:font-bold py-5">
									<Map className="scale-150" />
									<h3 className="text-lg ms-3">Map</h3>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<Link to="/features">
								<SidebarMenuButton className="cursor-pointer hover:font-bold py-5">
									<Sheet className="scale-150" />
									<h3 className="text-lg ms-3">
										Features List
									</h3>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<Link to="/settings">
							<SidebarMenuButton className="cursor-pointer hover:font-bold">
								<Cog className="scale-150" />
								<h3 className="text-md ms-2">Settings</h3>
							</SidebarMenuButton>
						</Link>
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
