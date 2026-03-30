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
} from "@/components/ui/sidebar";
import { LogOut, Map, Sheet, Cog } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import auth from "@/services/api/auth";
import logo from "@/assets/logo.png";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function AppSidebar({
	setLoggingOut,
	setOpenMobile,
	handleCollapse,
}: any) {
	const isMobile = useIsMobile();

	const navigate = useNavigate();
	const handleLogout = async () => {
		setLoggingOut(true);
		await auth.logout();
		navigate("/login");
		setLoggingOut(false);
	};

	const location = useLocation();

	useEffect(() => {
		setOpenMobile(false);
	}, [location.pathname, setOpenMobile]);

	return (
		<Sidebar
			collapsible={isMobile ? "offcanvas" : "icon"}
			className="border-r border-gray-300"
		>
			<SidebarHeader className="group flex flex-row justify-between border-b border-gray-300">
				<Link
					to="/"
					className="flex items-center gap-2 overflow-hidden"
				>
					<img src={logo} alt="app logo" className="w-10 shrink-0" />
					<h2 className="font-bold text-2xl whitespace-nowrap group-data-[collapsed=true]:hidden">
						SimpleGIS
					</h2>
				</Link>

				{isMobile && (
					<SidebarTrigger
						className="z-999 bg-white "
						onClick={handleCollapse}
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
			<SidebarFooter className="border-t border-gray-300">
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
