import { useMenu } from "@/hooks/use-menu";
import { useLocation } from "@tanstack/react-router";
import { MENU_SIDEBAR_MAIN } from "./layout-config";
import { Wrapper } from "./layout-wrapper";
import { LayoutProvider } from "./layout-provider";

export function AppLayout() {
	const { pathname } = useLocation();
	const { getCurrentItem } = useMenu(pathname);
	const item = getCurrentItem(MENU_SIDEBAR_MAIN);

	return (
		<>
			<title>{item?.title}</title>
			<LayoutProvider
				style={
					{
						"--sidebar-width": "240px",
						"--sidebar-width-mobile": "240px",
						"--header-height": "54px",
						"--header-height-mobile": "54px",
					} as React.CSSProperties
				}
			>
				<Wrapper />
			</LayoutProvider>
		</>
	);
}
