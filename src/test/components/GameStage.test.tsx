import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameStage from "../../components/GameStage";

describe("GameStage", () => {
	const defaultProps = {
		title: "Test Stage",
		instructions: "Complete the challenge",
		elapsed: 3.5,
		onRestart: vi.fn(),
		children: <div>Game content</div>,
	};

	it("renders the stage title", () => {
		render(<GameStage {...defaultProps} />);
		expect(screen.getByText("Test Stage")).toBeInTheDocument();
	});

	it("renders the instructions", () => {
		render(<GameStage {...defaultProps} />);
		expect(screen.getByText("Complete the challenge")).toBeInTheDocument();
	});

	it("displays the elapsed time", () => {
		render(<GameStage {...defaultProps} />);
		expect(screen.getByText(/3\.5s/)).toBeInTheDocument();
	});

	it("renders children content", () => {
		render(<GameStage {...defaultProps} />);
		expect(screen.getByText("Game content")).toBeInTheDocument();
	});

	it("renders a Restart Game button", () => {
		render(<GameStage {...defaultProps} />);
		expect(
			screen.getByRole("button", { name: /restart game/i }),
		).toBeInTheDocument();
	});

	it("calls onRestart when the restart button is clicked", async () => {
		const onRestart = vi.fn();
		render(<GameStage {...defaultProps} onRestart={onRestart} />);
		await userEvent.click(
			screen.getByRole("button", { name: /restart game/i }),
		);
		expect(onRestart).toHaveBeenCalledOnce();
	});

	it("renders a difficulty selector when provided", () => {
		render(
			<GameStage
				{...defaultProps}
				difficultySelector={{
					label: "Difficulty",
					id: "difficulty-select",
					value: "easy",
					onChange: vi.fn(),
					options: [
						{ value: "easy", label: "Easy" },
						{ value: "hard", label: "Hard" },
					],
				}}
			/>,
		);
		expect(screen.getByLabelText("Difficulty:")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toHaveValue("easy");
	});

	it("calls difficulty onChange when difficulty changes", async () => {
		const onChange = vi.fn();
		render(
			<GameStage
				{...defaultProps}
				difficultySelector={{
					label: "Difficulty",
					id: "difficulty-select",
					value: "easy",
					onChange,
					options: [
						{ value: "easy", label: "Easy" },
						{ value: "hard", label: "Hard" },
					],
				}}
			/>,
		);
		await userEvent.selectOptions(screen.getByRole("combobox"), "hard");
		expect(onChange).toHaveBeenCalledWith("hard");
	});
});
