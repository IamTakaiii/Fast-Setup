import { useLayout } from "@/hooks/use-layout";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./sidebar/sidebar";
import { Header } from "./header/header";

export function Wrapper() {
	const { isMobile } = useLayout();

	return (
		<>
			<Header />
			<div className="flex grow pt-(--header-height-mobile) lg:pt-(--header-height)">
				{!isMobile && <Sidebar />}
				<main
					className="lg:ps-(--sidebar-width) lg:in-data-[sidebar-open=false]:ps-0 transition-all duration-300 grow"
					role="content"
				>
					<Outlet />
				</main>
			</div>
		</>
	);
}
