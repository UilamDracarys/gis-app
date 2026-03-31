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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Map,
	Sheet,
	Cog,
	LogOutIcon,
	Key,
	ChevronsUpDown,
	CircleAlert,
	AlertTriangle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import auth from "@/services/api/auth";
import logo from "@/assets/logo.png";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { MESSAGES } from "@/constants/messages";

export function AppSidebar({
	setLoggingOut,
	setOpenMobile,
	handleCollapse,
	user,
}: any) {
	const isMobile = useIsMobile();
	const warnings = MESSAGES.WARNINGS;
	let avatarFallback = "";
	if (user.first_name)
		avatarFallback += user.first_name.charAt(0).toUpperCase();
	if (user.last_name)
		avatarFallback += user.last_name.charAt(0).toUpperCase();
	if (avatarFallback == "")
		avatarFallback += user.username.charAt(0).toUpperCase();

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
			<SidebarFooter className="border-t border-gray-300 ">
				{warnings.length > 0 && (
					<SidebarGroup className="warnings p-0">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									className="p-0 h-auto hover:bg-yellow-100"
									asChild
								>
									<div className="flex rounded-md bg-yellow-100 border border-yellow-800 p-3">
										<AlertTriangle className="text-yellow-800" />
										{warnings.map((msg) => (
											<div className="text-yellow-800 break-words text-sm leading-snug">
												{msg}
											</div>
										))}
									</div>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				)}

				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar>
										<AvatarImage src="" />
										<AvatarFallback>
											{avatarFallback}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{user.username}
										</span>
										<span className="truncate text-xs">
											{user.email}
										</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align="end"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar>
											<AvatarImage src="" />
											<AvatarFallback>
												{avatarFallback}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">
												{user.username}
											</span>
											<span className="truncate text-xs">
												{user.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuGroup>
									<Link to="/change-password">
										<DropdownMenuItem>
											<Key />
											Change Password
										</DropdownMenuItem>
									</Link>
								</DropdownMenuGroup>
								<DropdownMenuGroup>
									<Link to="/settings">
										<DropdownMenuItem>
											<Cog />
											Settings
										</DropdownMenuItem>
									</Link>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOutIcon />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
