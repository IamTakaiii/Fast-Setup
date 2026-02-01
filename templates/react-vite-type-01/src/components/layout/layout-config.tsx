import {
	ChartLine,
	Cog,
	UserRoundCog,
	Bolt,
	Users,
	Download,
	FileChartLine,
	SquareActivity,
	Newspaper,
	Briefcase,
	Megaphone,
} from "lucide-react";

import { type LucideIcon } from "lucide-react";

export interface MenuItem {
	title?: string;
	desc?: string;
	img?: string;
	icon?: LucideIcon;
	path?: string;
	rootPath?: string;
	childrenIndex?: number;
	heading?: string;
	children?: MenuConfig;
	disabled?: boolean;
	collapse?: boolean;
	collapseTitle?: string;
	expandTitle?: string;
	badge?: string;
	separator?: boolean;
}

export type MenuConfig = MenuItem[];

export const MENU_SIDEBAR_MAIN: MenuConfig = [
	{
		title: "General",
		children: [
			{
				title: "Dashboards",
				path: "#",
				icon: Bolt,
			},
			{
				title: "Public Profiles",
				path: "/layout-12",
				icon: Users,
			},
			{
				title: "Account Settings",
				path: "#",
				icon: UserRoundCog,
			},
			{
				title: "Network",
				path: "#",
				icon: Cog,
				badge: "Beta",
			},
			{
				title: "Authentication",
				path: "#",
				icon: ChartLine,
			},
		],
	},
];

export const MENU_SIDEBAR_RESOURCES: MenuConfig = [
	{
		title: "Resources",
		children: [
			{
				title: "About Metronic",
				path: "#",
				icon: Download,
			},
			{
				title: "Advertise",
				path: "#",
				icon: FileChartLine,
				badge: "Pro",
			},
			{
				title: "Help",
				path: "#",
				icon: SquareActivity,
			},
			{
				title: "Blog",
				path: "#",
				icon: Newspaper,
			},
			{
				title: "Careers",
				path: "#",
				icon: Briefcase,
			},
			{
				title: "Press",
				path: "#",
				icon: Megaphone,
			},
		],
	},
];
