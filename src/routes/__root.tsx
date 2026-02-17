import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

function RootLayout() {
	return (
		<div className="min-h-screen font-sans bg-slate-50">
			<div className="mx-auto bg-white rounded-b-lg shadow-2xl max-w-7xl">
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
