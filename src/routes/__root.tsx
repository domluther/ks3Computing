import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

function RootLayout() {
	return (
		<div className="bg-slate-50 min-h-screen font-sans">
			<div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-b-lg">
				<Header />
				<Navbar />
				<main>
					<Outlet />
				</main>
			</div>
			<TanStackRouterDevtools />
		</div>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
