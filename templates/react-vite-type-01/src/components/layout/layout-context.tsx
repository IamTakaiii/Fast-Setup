import { createContext } from "react";

interface LayoutState {
	style: React.CSSProperties;
	bodyClassName: string;
	isMobile: boolean;
	isSidebarOpen: boolean;
	sidebarToggle: () => void;
}

export const LayoutContext = createContext<LayoutState | undefined>(undefined);
