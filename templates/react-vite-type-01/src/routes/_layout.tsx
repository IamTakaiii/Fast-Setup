import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_layout")({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
	},
	component: AppLayout,
});
