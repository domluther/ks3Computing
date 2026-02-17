import { createFileRoute, useNavigate } from "@tanstack/react-router";
import HomePageButton from "../components/HomePageButton";
import { navItems } from "../data/pages";

const HomePage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="max-w-4xl p-8 mx-auto text-center">
			<h2 className="mb-4 text-4xl font-bold text-slate-800">
				Welcome to KS3 Computing! 🎉
			</h2>
			<p className="mb-6 text-lg leading-relaxed text-slate-600">
				Hello Year 7, 8, and 9 students! This website contains a collection of
				interactive tools and activities designed to help you learn and practice
				key concepts in Computing.
			</p>
			<div className="grid md:grid-cols-3 gap-6">
				{/* Don't show the home button on the home screen */}
				{navItems.map((item) =>
					item.id !== "home" ? (
						<HomePageButton key={item.id} navItem={item} navigate={navigate} />
					) : null,
				)}
			</div>
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: HomePage,
});
