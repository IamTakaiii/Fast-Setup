import { useTranslation } from "node_modules/react-i18next";

export function AuthVisuals() {
	const { t } = useTranslation();

	return (
		<>
			<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
			<div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

			<div className="relative z-10 flex items-center gap-2 font-bold text-lg">
				<div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
					<div className="h-4 w-4 bg-white rounded-full" />
				</div>
				{t("auth.visuals.company")}
			</div>

			<div className="relative z-10 max-w-lg">
				<h1 className="text-4xl font-semibold tracking-tight mb-4">
					"{t("auth.visuals.quote")}"
				</h1>
				<p className="text-zinc-400 text-sm">{t("auth.visuals.author")}</p>
			</div>
		</>
	);
}
