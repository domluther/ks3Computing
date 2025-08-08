import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";

interface HubButton {
	text: string;
	route: string;
	color: "blue" | "green" | "red" | "orange" | "purple" | "yellow" | "indigo";
}

interface HubLayoutProps {
	basePath: string;
	title: string;
	description: string;
	buttons: HubButton[];
}

const colorClasses = {
	blue: "bg-blue-500 hover:bg-blue-700",
	green: "bg-green-500 hover:bg-green-700",
	red: "bg-red-500 hover:bg-red-700",
	orange: "bg-orange-500 hover:bg-orange-700",
	purple: "bg-purple-500 hover:bg-purple-700",
	yellow: "bg-yellow-500 hover:bg-yellow-700",
	indigo: "bg-indigo-500 hover:bg-indigo-700",
};

const HubLayout: React.FC<HubLayoutProps> = ({
	basePath,
	title,
	description,
	buttons,
}) => {
	const navigate = useNavigate();
	const location = useLocation();

	// Show intro page if we're at the base route
	if (location.pathname === basePath) {
		return (
			<div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
				<div className="text-center p-8">
					<h2 className="text-4xl font-bold text-slate-800 mb-4">{title}</h2>
					<p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
						{description}
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-6">
						{buttons.map((button) => (
							<button
								key={button.route}
								onClick={() => navigate({ to: button.route })}
								className={`${colorClasses[button.color]} text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors`}
								type="button"
							>
								{button.text}
							</button>
						))}
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
};

export default HubLayout;
