import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Error500 } from "@/pages/error-500";

export const Route = createRootRoute({
	component: Outlet,
	errorComponent: Error500,
});
