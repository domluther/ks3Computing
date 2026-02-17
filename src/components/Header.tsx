import type React from "react";

const Header: React.FC = () => (
	<header className="p-5 text-center text-white shadow-md bg-linear-to-r from-blue-500 to-cyan-400">
		<h1 className="mb-2 text-4xl font-bold text-shadow">
			💻 Mr Luther's KS3 Computing
		</h1>
		<p className="text-lg opacity-90">
			Interactive tools and resources for Key Stage 3 Computing students
		</p>
	</header>
);

export default Header;
