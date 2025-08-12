import { useNavigate } from "@tanstack/react-router";

export const BackToHub: React.FC<{ location: string }> = ({ location }) => {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate({ to: location })}
			className="text-slate-600 hover:text-slate-800 font-semibold py-3 px-6"
			type="button"
		>
			Back to Hub
		</button>
	);
};

export const GameButton: React.FC<{
	onClick: () => void;
	children: React.ReactNode;
	className?: string;
}> = ({ onClick, children, className }) => (
	<button
		onClick={onClick}
		className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform text-xl ${className}`}
		type="button"
	>
		{children}
	</button>
);
