import { Link } from "@tanstack/react-router";
import { useTranslation } from "node_modules/react-i18next";

export function AuthTerms() {
	const { t } = useTranslation();

	return (
		<p className="px-8 text-center text-sm text-muted-foreground">
			{t("auth.terms.text")}{" "}
			<TermLink to="/terms">{t("auth.terms.terms_of_service")}</TermLink>{" "}
			{t("auth.terms.and")}{" "}
			<TermLink to="/privacy">{t("auth.terms.privacy_policy")}</TermLink>.
		</p>
	);
}

function TermLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<Link to={to} className="underline underline-offset-4 hover:text-primary">
			{children}
		</Link>
	);
}
