import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useCommandStore } from "@/store/use-command-store";
import { cn } from "@/lib/utils";

interface HeaderSearchProps {
	isMobileNav?: boolean;
}

export function HeaderSearch({ isMobileNav }: HeaderSearchProps) {
	const { setIsOpen } = useCommandStore();

	return (
		<div className={cn("flex items-center", isMobileNav && "w-full px-5 py-3")}>
			<Button
				variant="outline"
				className={cn(
					"relative h-9 w-9 p-0 lg:h-10 lg:w-96 lg:justify-start lg:px-3 lg:py-2 text-muted-foreground hover:text-foreground",
					isMobileNav && "h-10 w-full justify-start px-3 py-2"
				)}
				onClick={() => setIsOpen(true)}
			>
				<Search className={cn("h-4 w-4 lg:mr-2", isMobileNav && "mr-2")} />
				<span
					className={cn("hidden lg:inline-flex", isMobileNav && "inline-flex")}
				>
					Search...
				</span>
				<kbd
					className={cn(
						"pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex",
						isMobileNav && "flex"
					)}
				>
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
		</div>
	);
}
