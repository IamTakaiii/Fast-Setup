import { toAbsoluteUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function PageLoading() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4">
			<div className="relative flex items-center justify-center w-20 h-20">
				<img
					src={toAbsoluteUrl("/media/app/mini-logo-gray.svg")}
					className="dark:hidden absolute inset-0 h-full w-full object-contain animate-pulse"
					alt="Loading..."
				/>
				<img
					src={toAbsoluteUrl("/media/app/mini-logo-gray-dark.svg")}
					className="hidden dark:block absolute inset-0 h-full w-full object-contain animate-pulse"
					alt="Loading..."
				/>
			</div>

			<div className="flex items-center gap-2 text-muted-foreground">
				<Loader2 className="h-5 w-5 animate-spin text-primary" />
				<span className="text-sm font-medium">Loading...</span>
			</div>
		</div>
	);
}
