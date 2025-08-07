import {
	createFileRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";

function HardwareSoftwareLayout() {
	const navigate = useNavigate();
	const location = useLocation();

	// Show intro page if we're at the base Hardware & Software route
	if (location.pathname === "/hardware-software") {
		return (
			<div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
				<div className="text-center p-8">
					<h2 className="text-4xl font-bold text-slate-800 mb-4">
						Hardware & Software Hub
					</h2>
					<p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
						Learn all about hardware & software. What is a computer? What types of hardware are there?
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-6">
						<button
							onClick={() => navigate({ to: "/hardware-software/input-output" })}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
							type="button"
						>
							Input Output Challenge
						</button>
					</div>
				</div>
			</div>
		)
	}

	// Render child routes for sub-pages
	return (
		<div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
			<Outlet />
		</div>
	)
}

export const Route = createFileRoute("/hardware-software")({
	component: HardwareSoftwareLayout,
});
