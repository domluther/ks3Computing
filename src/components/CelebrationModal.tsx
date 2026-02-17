import type React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { GameButton } from "./Buttons";

interface CelebrationModalProps {
	onClose: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ onClose }) => {
	const { width, height } = useWindowSize();

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			{/* Confetti covers the full screen */}
			<Confetti
				width={width}
				height={height}
				recycle={false}
				numberOfPieces={300}
			/>

			{/* Modal content */}
			<div className="relative z-10 max-w-sm p-8 mx-auto text-center bg-white shadow-2xl rounded-2xl">
				<h2 className="mb-4 text-4xl font-extrabold text-yellow-500">
					🎉 Congratulations! 🎉
				</h2>
				<p className="mb-4 text-2xl">You did it! 🐥🦆</p>
				<GameButton onClick={onClose}>Close</GameButton>
			</div>
		</div>
	);
};

export default CelebrationModal;
