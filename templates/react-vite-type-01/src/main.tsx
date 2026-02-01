import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { routeTree } from "./routeTree.gen.ts";
import "./styles/tailwind.css";
import "./common/i18n.ts";

const router = createRouter({ routeTree });

export type TanstackRouter = typeof router;

declare module "@tanstack/react-router" {
	interface Register {
		router: TanstackRouter;
	}
}

import { PageLoading } from "@/components/ui/loading";
import { CommandMenu } from "@/components/ui/command-menu.tsx";

import { ThemeProvider } from "next-themes";

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<React.Suspense fallback={<PageLoading />}>
					<App router={router} />
					<CommandMenu />
				</React.Suspense>
			</ThemeProvider>
		</React.StrictMode>
	);
}
