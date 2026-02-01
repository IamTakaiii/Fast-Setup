import { useState, lazy, Suspense } from "react";
import { isProduction } from "../../../common/utils";
import inspectorIcon from "@/assets/images/inspector.png";

const Inspector = lazy(() =>
	import("react-dev-inspector").then((module) => ({
		default: module.Inspector,
	}))
);

export const ReactDevInspector = () => {
	const [active, setActive] = useState(false);

	if (isProduction) return null;

	return (
		<>
			<Suspense fallback={null}>
				<Inspector active={active} onActiveChange={setActive} />
			</Suspense>
			<div className="fixed bottom-20 right-4 z-50">
				<button
					className={`flex size-14 items-center justify-center rounded-full border-2 shadow-xl transition-all overflow-hidden ${
						active
							? "border-blue-500 grayscale-0"
							: "border-transparent grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-110"
					}`}
					onClick={() => setActive(!active)}
					aria-label="Toggle Inspector"
				>
					<img
						src={inspectorIcon}
						alt="Inspector"
						className="size-full object-cover"
					/>
				</button>
			</div>
		</>
	);
};
