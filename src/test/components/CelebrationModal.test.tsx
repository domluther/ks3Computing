import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CelebrationModal from "../../components/CelebrationModal";

vi.mock("react-confetti", () => ({
	default: () => null,
}));

vi.mock("react-use", () => ({
	useWindowSize: () => ({ width: 1024, height: 768 }),
}));

describe("CelebrationModal", () => {
	it("renders the congratulations heading", () => {
		render(<CelebrationModal onClose={() => {}} />);
		expect(screen.getByText(/Congratulations/i)).toBeInTheDocument();
	});

	it("renders a close button", () => {
		render(<CelebrationModal onClose={() => {}} />);
		expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
	});

	it("calls onClose when the close button is clicked", async () => {
		const onClose = vi.fn();
		render(<CelebrationModal onClose={onClose} />);
		await userEvent.click(screen.getByRole("button", { name: /close/i }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("renders inside a fixed overlay", () => {
		const { container } = render(<CelebrationModal onClose={() => {}} />);
		const overlay = container.firstChild as HTMLElement;
		expect(overlay).toHaveClass("fixed");
	});
});
