import {
	createFileRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";

function ITSkillsLayout() {
	const navigate = useNavigate();
	const location = useLocation();

	// Show intro page if we're at the base IT Skills route
	if (location.pathname === "/it-skills") {
		return (
			<div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
				<div className="text-center p-8">
					<h2 className="text-4xl font-bold text-slate-800 mb-4">
						IT Skills Hub
					</h2>
					<p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
						Practice essential computer skills through hands-on activities.
						Master mouse control and file management!
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-6">
						<button
							onClick={() => navigate({ to: "/it-skills/mouse-skills" })}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
						>
							Mouse Skills Challenge
						</button>
						<button
							onClick={() => navigate({ to: "/it-skills/file-simulation" })}
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
						>
							File Simulation
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

export const Route = createFileRoute("/it-skills")({
	component: ITSkillsLayout,
});
