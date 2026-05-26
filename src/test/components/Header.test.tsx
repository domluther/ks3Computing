import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";

describe("Header", () => {
	it("renders the main site heading", () => {
		render(<Header />);
		expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
	});

	it("displays KS3 Computing in the heading", () => {
		render(<Header />);
		expect(screen.getByText(/KS3 Computing/i)).toBeInTheDocument();
	});

	it("renders the descriptive subtitle", () => {
		render(<Header />);
		expect(
			screen.getByText(/Interactive tools and resources/i),
		).toBeInTheDocument();
	});

	it("renders a header element", () => {
		const { container } = render(<Header />);
		expect(container.querySelector("header")).toBeInTheDocument();
	});
});
