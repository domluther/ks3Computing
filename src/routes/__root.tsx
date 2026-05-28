import {
	createRootRoute,
	Link,
	Outlet,
	useRouter,
} from "@tanstack/react-router";
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

function RootErrorComponent({ error }: { error: Error }) {
	const router = useRouter();
	const isChunkError =
		error?.message?.toLowerCase().includes("failed to fetch") ||
		error?.message?.toLowerCase().includes("dynamically imported module") ||
		error?.message?.toLowerCase().includes("loading chunk");

	const blockedUrl = isChunkError
		? (error.message.match(/https?:\/\/\S+/) ?? [])[0]
		: null;

	return (
		<div className="min-h-screen font-sans bg-slate-50">
			<div className="mx-auto bg-white rounded-b-lg shadow-2xl max-w-7xl">
				<Header />
				<Navbar />
				<main className="flex flex-col items-center justify-center px-6 py-24 text-center gap-6">
					<div className="text-5xl">⚠️</div>
					<h1 className="text-2xl font-bold text-slate-800">
						Oops! This page didn't load
					</h1>
					{isChunkError ? (
						<p className="max-w-md text-slate-600">
							The school network blocked part of this page from loading. Try
							clicking <strong>Try again</strong> — if it still doesn't work,
							ask your teacher for help.
						</p>
					) : (
						<p className="max-w-md text-slate-600">
							Something went wrong. Try clicking <strong>Try again</strong> or
							go back to the home page.
						</p>
					)}
					{blockedUrl && (
						<div className="w-full max-w-xl p-4 text-left border rounded-lg border-amber-200 bg-amber-50">
							<p className="mb-1 text-sm font-semibold text-amber-800">
								Blocked URL (for your teacher / IT):
							</p>
							<p className="font-mono text-sm break-all text-amber-900">
								{blockedUrl}
							</p>
						</div>
					)}
					<div className="flex flex-wrap justify-center gap-3">
						<button
							type="button"
							onClick={() => router.invalidate()}
							className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
						>
							Try again
						</button>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-2 font-medium border rounded-lg transition-colors border-slate-300 text-slate-700 hover:bg-slate-50"
						>
							Refresh page
						</button>
						<Link
							to="/"
							className="px-4 py-2 font-medium text-white rounded-lg transition-colors bg-slate-700 hover:bg-slate-800"
						>
							Go to home page
						</Link>
					</div>
					{import.meta.env.DEV && (
						<pre className="max-w-xl p-4 mt-4 overflow-auto text-xs text-left text-red-700 rounded-lg bg-slate-100">
							{error.stack ?? error.message}
						</pre>
					)}
				</main>
			</div>
		</div>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
	errorComponent: RootErrorComponent,
});
