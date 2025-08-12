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
			<div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-auto relative z-10">
				<h2 className="text-4xl font-extrabold text-yellow-500 mb-4">
					🎉 Congratulations! 🎉
				</h2>
				<p className="text-2xl mb-4">You did it! 🐥🦆</p>
				<GameButton onClick={onClose}>Close</GameButton>
			</div>
		</div>
	);
};

export default CelebrationModal;
