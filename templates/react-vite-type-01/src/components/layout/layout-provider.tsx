import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode, useEffect, useState } from "react";
import { LayoutContext } from "./layout-context";
import { TooltipProvider } from "../ui/tooltip";

interface LayoutProviderProps {
	children: ReactNode;
	style?: React.CSSProperties;
	bodyClassName?: string;
}

const HEADER_HEIGHT = "60px";
const SIDEBAR_WIDTH = "16rem";

export function LayoutProvider({
	children,
	style: customStyle,
	bodyClassName = "",
}: LayoutProviderProps) {
	const isMobile = useIsMobile();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const defaultStyle: React.CSSProperties = {
		"--sidebar-width": SIDEBAR_WIDTH,
		"--header-height": HEADER_HEIGHT,
	} as React.CSSProperties;

	const style: React.CSSProperties = {
		...defaultStyle,
		...customStyle,
	};

	const sidebarToggle = () => setIsSidebarOpen((open) => !open);

	useEffect(() => {
		if (bodyClassName) {
			const body = document.body;
			const existingClasses = body.className;
			body.className = `${existingClasses} ${bodyClassName}`.trim();
			return () => {
				body.className = existingClasses;
			};
		}
		return;
	}, [bodyClassName]);

	return (
		<LayoutContext.Provider
			value={{
				bodyClassName,
				style,
				isMobile,
				isSidebarOpen,
				sidebarToggle,
			}}
		>
			<div
				data-slot="layout-wrapper"
				className="flex grow"
				data-sidebar-open={isSidebarOpen}
				style={style}
			>
				<TooltipProvider delayDuration={0}>{children}</TooltipProvider>
			</div>
		</LayoutContext.Provider>
	);
}
