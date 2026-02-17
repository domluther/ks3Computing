import type React from "react";

interface PlaceholderPageProps {
	title: string;
	icon: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon }) => (
	<div className="p-20 text-center">
		<div className="mb-4 text-6xl">{icon}</div>
		<h2 className="mb-4 text-4xl font-bold text-slate-700">{title}</h2>
		<p className="text-xl text-slate-500">This exciting tool is coming soon!</p>
	</div>
);

export default PlaceholderPage;
