import { useNavigate } from "@tanstack/react-router";

function BackToHub({ location }: { location: string }) {
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
}

export default BackToHub;
