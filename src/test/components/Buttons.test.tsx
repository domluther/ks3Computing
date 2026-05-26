import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BackToHub, GameButton } from "../../components/Buttons";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => mockNavigate,
}));

describe("GameButton", () => {
	it("renders children text", () => {
		render(<GameButton onClick={() => {}}>Start Game</GameButton>);
		expect(
			screen.getByRole("button", { name: "Start Game" }),
		).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const onClick = vi.fn();
		render(<GameButton onClick={onClick}>Click Me</GameButton>);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledOnce();
	});

	it("applies custom className", () => {
		render(
			<GameButton onClick={() => {}} className="extra-class">
				Test
			</GameButton>,
		);
		expect(screen.getByRole("button")).toHaveClass("extra-class");
	});

	it("renders as a button element with type=button", () => {
		render(<GameButton onClick={() => {}}>Test</GameButton>);
		expect(screen.getByRole("button")).toHaveAttribute("type", "button");
	});
});

describe("BackToHub", () => {
	it("renders a Back to Hub button", () => {
		render(<BackToHub location="/hardware-software" />);
		expect(
			screen.getByRole("button", { name: /back to hub/i }),
		).toBeInTheDocument();
	});

	it("calls navigate when clicked", async () => {
		render(<BackToHub location="/test-hub" />);
		await userEvent.click(screen.getByRole("button", { name: /back to hub/i }));
		expect(mockNavigate).toHaveBeenCalledWith({ to: "/test-hub" });
	});
});
