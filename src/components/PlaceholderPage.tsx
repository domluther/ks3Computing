import type React from "react";

interface PlaceholderPageProps {
	title: string;
	icon: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon }) => (
	<div className="text-center p-20">
		<div className="text-6xl mb-4">{icon}</div>
		<h2 className="text-4xl font-bold text-slate-700 mb-4">{title}</h2>
		<p className="text-xl text-slate-500">This exciting tool is coming soon!</p>
	</div>
);

export default PlaceholderPage;
