import { useNavigate } from "@tanstack/react-router";

export const BackToHub: React.FC<{ location: string }> = ({ location }) => {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate({ to: location })}
			className="px-5 py-2.5 rounded-lg font-semibold bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
			type="button"
		>
			← Back to Hub
		</button>
	);
};

export const GameButton: React.FC<{
	onClick: () => void;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}> = ({ onClick, children, className, disabled }) => (
	<button
		onClick={onClick}
		disabled={disabled}
		className={`bg-linear-to-r bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform text-xl ${
			disabled
				? "opacity-50 cursor-not-allowed"
				: "hover:scale-105 cursor-pointer"
		} ${className}`}
		type="button"
	>
		{children}
	</button>
);
