import {
	createFileRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";

function MathsLayout() {
	const navigate = useNavigate();
	const location = useLocation();

	// Show intro page if we're at the base Maths route
	if (location.pathname === "/maths") {
		return (
			<div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
				<div className="text-center p-8">
					<h2 className="text-4xl font-bold text-slate-800 mb-4">
						Computing Maths Hub
					</h2>
					<p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
						Learn how computers represent data. Discover how to decode ASCII and
						understand how computers represent text!
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-6">
						<button
							onClick={() => navigate({ to: "/maths/ascii" })}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
							type="button"
						>
							ASCII
						</button>
						{/* <button
							onClick={() => navigate({ to: "/maths/file-simulation" })}
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
							type="button"
						>
							File Simulation
						</button> */}
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

export const Route = createFileRoute("/maths")({
	component: MathsLayout,
});
