import {
	createFileRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";

function OnlineSafetyLayout() {
	const navigate = useNavigate();
	const location = useLocation();

	// Show intro page if we're at the base Online Safety route
	if (location.pathname === "/online-safety") {
		return (
			<div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
				<div className="text-center p-8">
					<h2 className="text-4xl font-bold text-slate-800 mb-4">
						Online Safety Hub
					</h2>
					<p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
						Staying safe online is a vital skill. These activities will help you
						think critically about your digital footprint and online
						interactions.
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-6">
						<button
							onClick={() => navigate({ to: "/online-safety/social-credit" })}
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
							type="button"
						>
							The Social Credit Game
						</button>
						<button
							onClick={() => navigate({ to: "/online-safety/phishing" })}
							className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
							type="button"
						>
							Spot the Phish!
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Render child routes for sub-pages
	return (
		<div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
			<Outlet />
		</div>
	);
}

export const Route = createFileRoute("/online-safety")({
	component: OnlineSafetyLayout,
});
