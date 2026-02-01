import { Check, Languages } from "lucide-react";
import { useTranslation } from "node_modules/react-i18next";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const languages = [
		{ code: "en", label: "English" },
		{ code: "th", label: "ไทย (Thai)" },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-10 w-10 rounded-full hover:bg-muted"
					aria-label="Switch language"
				>
					<Languages className="h-5 w-5" />
					<span className="sr-only">Switch language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang.code}
						onClick={() => i18n.changeLanguage(lang.code)}
						className="flex items-center justify-between gap-2 cursor-pointer"
					>
						<span>{lang.label}</span>
						{i18n.language === lang.code && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
