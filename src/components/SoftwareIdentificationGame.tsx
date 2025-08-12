import {
	CheckCircle,
	HelpCircle,
	Monitor,
	FileText,
	Image,
	BarChart3,
	Globe,
	Layout,
	XCircle,
} from "lucide-react";
import { type ReactNode, useState } from "react";

const SoftwareIdentificationGame = () => {
	// --- TYPE DEFINITIONS ---
	type GameStage = "intro" | "playing" | "feedback" | "results";

	interface Scenario {
		id: number;
		text: string;
		choices: {
			softwareType: string;
			softwareName: string;
			isCorrect: boolean;
			feedback: string;
		}[];
		explanation: string;
		correctSoftware: string;
	}

	// --- GAME DATA ---
	const scenarios: Scenario[] = [
		{
			id: 1,
			text: "Your teacher asks you to write a 500-word essay about your summer holidays for homework.",
			choices: [
				{
					softwareType: "Word processing software",
					softwareName: "Microsoft Word",
					isCorrect: true,
					feedback: "Perfect! Word processing software is designed for creating, editing and formatting text documents like essays.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback: "Presentation software is for creating slides, not writing long text documents like essays.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback: "Spreadsheet software is for working with numbers and data in tables, not writing essays.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback: "Graphics software is for creating and editing images, not writing text documents.",
				},
			],
			explanation: "Essays require creating, editing and formatting text documents - this is exactly what word processing software does best.",
			correctSoftware: "Word Processing",
		},
		{
			id: 2,
			text: "You need to create a colourful poster advertising the school's upcoming sports day for display around school.",
			choices: [
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: true,
					feedback: "Excellent! DTP software is specifically designed for creating posters, flyers and other publications with text and images.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback: "While you could make a poster in PowerPoint, DTP software is more appropriate for printed posters with professional layouts.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word is mainly for text documents. DTP software has better tools for combining text and images in poster layouts.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Google Chrome",
					isCorrect: false,
					feedback: "A web browser is for viewing websites, not creating posters.",
				},
			],
			explanation: "Posters need professional layout tools that combine text and images effectively - DTP software is designed specifically for this purpose.",
			correctSoftware: "Desktop Publishing",
		},
		{
			id: 3,
			text: "Your science teacher wants you to give a 5-minute talk to the class about the solar system, showing pictures and facts.",
			choices: [
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: true,
					feedback: "Perfect! Presentation software lets you create slides with images, text and animations to support your talk.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word is for documents, not for creating visual slides to show during a presentation.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback: "DTP is for printed materials like posters. Presentation software is better for on-screen slides.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback: "Graphics software creates individual images, but you need slides with text and multiple images for a presentation.",
				},
			],
			explanation: "Presentations require slides with images, text and possibly animations - this is what presentation software is designed for.",
			correctSoftware: "Presentation",
		},
		{
			id: 4,
			text: "You want to research information about climate change for a geography project by looking at different websites.",
			choices: [
				{
					softwareType: "Web browser",
					softwareName: "Chrome",
					isCorrect: true,
					feedback: "Exactly right! Web browsers are designed to open and view web pages from the internet.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word is for creating documents, not for viewing websites on the internet.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback: "Spreadsheets work with numbers and data, not for browsing websites.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback: "Graphics software is for creating and editing images, not browsing the web.",
				},
			],
			explanation: "To view websites and research online, you need web browser software that connects to the internet.",
			correctSoftware: "Web Browser",
		},
		{
			id: 5,
			text: "Your maths teacher asks you to create a chart showing the favourite pets of students in your class using survey data.",
			choices: [
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: true,
					feedback: "Perfect! Spreadsheet software is excellent for organizing data and creating charts and graphs.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "While Word can make basic charts, spreadsheet software has much better tools for working with data and creating charts.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback: "Graphics software creates images, but spreadsheet software is better for charts based on actual data.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Chrome",
					isCorrect: false,
					feedback: "Web browsers are for viewing websites, not creating charts from data.",
				},
			],
			explanation: "Working with numerical data and creating charts requires spreadsheet software's specialized tools.",
			correctSoftware: "Spreadsheet",
		},
		{
			id: 6,
			text: "You need to edit a photo of your school trip to remove red-eye and adjust the brightness before printing it.",
			choices: [
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: true,
					feedback: "Excellent! Graphics software has tools specifically designed for editing and enhancing photos.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word can insert photos but doesn't have advanced tools for editing images like removing red-eye.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback: "PowerPoint has basic image tools, but graphics software has much better photo editing capabilities.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Safari",
					isCorrect: false,
					feedback: "Web browsers are for viewing websites, not editing photos.",
				},
			],
			explanation: "Photo editing requires specialized tools for adjusting colours, removing red-eye and enhancing images - this is what graphics software provides.",
			correctSoftware: "Graphics",
		},
		{
			id: 7,
			text: "You want to create a newsletter for your school club with multiple columns, photos and different text styles.",
			choices: [
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: true,
					feedback: "Perfect! DTP software is designed for creating professional-looking publications like newsletters with complex layouts.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "While Word can make newsletters, DTP software has better tools for professional multi-column layouts.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback: "PowerPoint is for slides shown on screen, not for printed publications like newsletters.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback: "Spreadsheets work with numbers and data, not for creating formatted publications.",
				},
			],
			explanation: "Newsletters need professional layout tools for columns, text formatting and image placement - DTP software specializes in this.",
			correctSoftware: "Desktop Publishing",
		},
		{
			id: 8,
			text: "Your head of year asks you to keep track of how much money your year group raises for charity each week and calculate totals.",
			choices: [
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: true,
					feedback: "Excellent! Spreadsheets are perfect for tracking numbers, doing calculations and keeping running totals.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word is for text documents, not for calculating totals and working with numerical data.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback: "Graphics software is for images, not for tracking money and doing calculations.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback: "DTP is for creating publications, not for tracking numbers and doing calculations.",
				},
			],
			explanation: "Tracking money and calculating totals requires spreadsheet software's mathematical and data organization capabilities.",
			correctSoftware: "Spreadsheet",
		},
		{
			id: 9,
			text: "You need to write a formal letter to the local council about improving the playground in your area.",
			choices: [
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: true,
					feedback: "Perfect! Word processing software has templates and formatting tools ideal for creating formal letters.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback: "PowerPoint is for creating slides for presentations, not for writing formal letters.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Microsoft Edge",
					isCorrect: false,
					feedback: "Web browsers are for viewing websites, not creating documents like letters.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback: "Graphics software is for creating and editing images, not writing text documents.",
				},
			],
			explanation: "Formal letters require proper text formatting, spell-check and document templates - word processing software provides all these features.",
			correctSoftware: "Word Processing",
		},
		{
			id: 10,
			text: "You want to look up the opening times for the local cinema on their website.",
			choices: [
				{
					softwareType: "Web browser",
					softwareName: "Microsoft Edge",
					isCorrect: true,
					feedback: "Correct! You need a web browser to access and view websites on the internet.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word creates documents, but you need a web browser to view websites online.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback: "Spreadsheets work with data and numbers, not for browsing websites.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback: "DTP creates publications, but you need a web browser to access websites.",
				},
			],
			explanation: "To access any website, you need web browser software that can connect to the internet and display web pages.",
			correctSoftware: "Web Browser",
		},
		{
			id: 11,
			text: "Your art teacher wants you to create a digital drawing of your favourite animal for display.",
			choices: [
				{
					softwareType: "Graphics software",
					softwareName: "Paint, Photoshop",
					isCorrect: true,
					feedback: "Excellent! Graphics software has drawing tools, brushes and colours perfect for creating digital artwork.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word is mainly for text, not for creating detailed digital drawings and artwork.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback: "Spreadsheets work with numbers and data, not for creating drawings and artwork.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Google Chrome",
					isCorrect: false,
					feedback: "Web browsers view websites, not create digital drawings.",
				},
			],
			explanation: "Creating digital art requires specialized drawing tools, brushes and colour palettes that graphics software provides.",
			correctSoftware: "Graphics",
		},
		{
			id: 12,
			text: "You need to create a budget showing how you plan to spend your birthday money on different items.",
			choices: [
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: true,
					feedback: "Perfect! Spreadsheets excel at organizing financial data, calculating totals and creating budgets.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "While you could make a list in Word, spreadsheet software has better tools for calculations and budgets.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback: "PowerPoint is for slides and presentations, not for creating budgets with calculations.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Paint, Photoshop",
					isCorrect: false,
					feedback: "Graphics software is for images and artwork, not for financial calculations and budgets.",
				},
			],
			explanation: "Budgets involve numbers, calculations and data organization - spreadsheet software is designed specifically for this type of work.",
			correctSoftware: "Spreadsheet",
		},
		{
			id: 13,
			text: "Your English teacher asks you to create slides showing the main characters from a book you've read.",
			choices: [
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: true,
					feedback: "Correct! Presentation software lets you create slides with text, images and formatting to showcase information.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "Word is great for essays, but presentation software is better for creating visual slides.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback: "DTP is for printed materials. For on-screen slides, presentation software is more appropriate.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Safari",
					isCorrect: false,
					feedback: "Web browsers view websites, not create presentation slides.",
				},
			],
			explanation: "Creating slides to display information requires presentation software's slide layout and formatting tools.",
			correctSoftware: "Presentation",
		},
		{
			id: 14,
			text: "You want to design a birthday party invitation with decorative borders and colorful text to print and give to friends.",
			choices: [
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: true,
					feedback: "Excellent! DTP software has templates and design tools perfect for creating attractive printed invitations.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "While Word can make invitations, DTP software has better design tools and templates for this purpose.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback: "Spreadsheets are for numbers and data, not for creating designed invitations.",
				},
				{
					softwareType: "Web browser",
					softwareName: "MicrosoftEdge",
					isCorrect: false,
					feedback: "Web browsers view websites, not create printed invitations.",
				},
			],
			explanation: "Creating attractive printed materials like invitations requires DTP software's specialized design and layout tools.",
			correctSoftware: "Desktop Publishing",
		},
		{
			id: 15,
			text: "You need to research three different countries for a geography project by reading information on various educational websites.",
			choices: [
				{
					softwareType: "Web browser",
					softwareName: "Google Chrome",
					isCorrect: true,
					feedback: "Perfect! Web browsers are essential for accessing and reading information on websites.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback: "You'll use Word to write up your research, but first you need a web browser to access the websites.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback: "PowerPoint might be used to present your findings, but you need a web browser to research first.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Photoshop",
					isCorrect: false,
					feedback: "Graphics software works with images, but you need a web browser to read information online.",
				},
			],
			explanation: "Any online research requires web browser software to access and view educational websites on the internet.",
			correctSoftware: "Web Browser",
		},
		{
			id: 16,
			text: "You want to find out the score of the latest Manchester United game. Which application do you need to open?",
			choices: [
				{
					softwareType: "Web browser",
					softwareName: "Google Chrome",
					isCorrect: true,
					feedback:
						"That's right! A web browser like Google Chrome, Microsoft Edge, or Safari is used to access and view pages on the World Wide Web.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Google Docs",
					isCorrect: false,
					feedback:
						"Incorrect. A word processor is for creating documents on your computer; you need a browser to access the internet.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback:
						"This software is for making print layouts like flyers, not for browsing the internet.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"This is used for creating slides, not for looking up live information online.",
				},
			],
			explanation: "To find the score of a sports game, you need to access a sports news website or a live score service, which requires a web browser.",
			correctSoftware: "Web Browser",
		},
		{
			id: 17,
						text: "For your food technology homework, you've been asked to calculate the total cost of ingredients for a recipe and create a chart of the costs. What is the most appropriate software?",
			choices: [
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: true,
					feedback:
						"Perfect! Spreadsheet software is the best tool for calculations, managing data in cells, and creating charts.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Photoshop",
					isCorrect: false,
					feedback:
						"Not suitable. Graphics software is for drawing and editing images, not for performing calculations.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Google Docs",
					isCorrect: false,
					feedback:
						"You could write the list of ingredients, but it can't automatically calculate the total cost or easily create a chart from the data.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"Incorrect. Presentation software is for slides, not for managing and calculating data.",
				},
			],
			explanation: "To calculate costs and create charts, you need software that can handle data and perform calculations, which is best done with a spreadsheet.",
			correctSoftware: "Spreadsheet Software",
		},
		{
			id: 18,
			text: "You have taken a great photo of your dog and want to crop it, change the brightness, and add a funny hat on top. What kind of software would you use?",
			choices: [
				{
					softwareType: "Graphics software",
					softwareName: "Photoshop",
					isCorrect: true,
					feedback:
						"You got it! Graphics software is used to create and edit images, which includes cropping, adjustments, and adding elements.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Google Docs",
					isCorrect: false,
					feedback:
						"You can insert pictures into a word processor, but it has very limited tools for editing them properly.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Chrome",
					isCorrect: false,
					feedback:
						"A web browser lets you view images online, but it doesn't have the tools to edit your own photos.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Incorrect. Spreadsheets are for numbers and data, not for detailed image editing.",
				},
			],
			explanation: "To edit a photo, you need software that specializes in image manipulation, which is best provided by graphics editing tools.",
			correctSoftware: "Graphics Software",
		}
	];

	const questionsToAsk = 10; // Can be adjusted

	// --- STATE MANAGEMENT ---
	const [stage, setStage] = useState<GameStage>("intro");
	const [score, setScore] = useState(0);
	const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);
	const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
	const [lastChoice, setLastChoice] = useState<{
		isCorrect: boolean;
		feedback: string;
		explanation: string;
		correctSoftware: string;
	} | null>(null);
	const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);

	// --- UTILITY FUNCTIONS ---
	const shuffleArray = <T,>(array: T[]): T[] => {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}
		return newArray;
	};

	const getSoftwareIcon = (software: string): ReactNode => {
		switch (software.toLowerCase()) {
			case "word processing":
				return <FileText className="w-6 h-6" />;
			case "graphics":
				return <Image className="w-6 h-6" />;
			case "presentation":
				return <Monitor className="w-6 h-6" />;
			case "spreadsheet":
				return <BarChart3 className="w-6 h-6" />;
			case "web browser":
				return <Globe className="w-6 h-6" />;
			case "desktop publishing":
				return <Layout className="w-6 h-6" />;
			default:
				return <Monitor className="w-6 h-6" />;
		}
	};

	// --- GAME LOGIC ---
	const handleChoice = (isCorrect: boolean, feedback: string) => {
		const currentScenario = shuffledScenarios[currentScenarioIndex];
		if (isCorrect) {
			setScore((prev) => prev + 10);
		} else {
			setIncorrectAnswers((prev) => [...prev, currentScenario.correctSoftware]);
		}
		
		setLastChoice({
			isCorrect,
			feedback,
			explanation: currentScenario.explanation,
			correctSoftware: currentScenario.correctSoftware,
		});
		setStage("feedback");
	};

	const handleNext = () => {
		if (currentScenarioIndex < questionsToAsk - 1) {
			setCurrentScenarioIndex((prev) => prev + 1);
			setStage("playing");
		} else {
			setStage("results");
		}
		setLastChoice(null);
	};

	const startGame = () => {
		const shuffled = shuffleArray(scenarios).slice(0, questionsToAsk).map((s) => ({
			...s,
			choices: shuffleArray(s.choices),
		}));

		setShuffledScenarios(shuffled);
		setScore(0);
		setCurrentScenarioIndex(0);
		setLastChoice(null);
		setIncorrectAnswers([]);
		setStage("playing");
	};

	const resetGame = () => {
		setStage("intro");
	};

	// --- UI RENDERING ---
	const renderScoreBar = () => {
		const maxScore = questionsToAsk * 10;
		const percentage = (score / maxScore) * 100;
		
		return (
			<div className="w-full max-w-2xl bg-gray-200 rounded-full h-8 dark:bg-gray-700 my-4 shadow-inner">
				<div
					className="bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 h-8 rounded-full transition-all duration-500 ease-out"
					style={{ width: `${percentage}%` }}
				></div>
				<span className="relative bottom-8 text-center w-full block font-bold text-slate-800">
					{`Score: ${score}/${maxScore}`}
				</span>
			</div>
		);
	};

	const renderIntro = () => (
		<div className="text-center p-8 max-w-3xl mx-auto">
			<h1 className="text-4xl font-bold text-slate-800 mb-4">
				Software Identification Game
			</h1>
			<p className="text-lg text-slate-600 mb-6">
				Test your knowledge of different types of software! You'll face {questionsToAsk} scenarios
				where you need to choose the most appropriate software for each task.
			</p>
			
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8 text-sm">
				<div className="bg-blue-50 p-4 rounded-lg">
					<FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
					<div className="font-semibold">Word Processing</div>
					<div className="text-slate-600">Microsoft Word</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg">
					<Image className="w-8 h-8 text-green-600 mx-auto mb-2" />
					<div className="font-semibold">Graphics</div>
					<div className="text-slate-600">Paint, Photoshop</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg">
					<Monitor className="w-8 h-8 text-purple-600 mx-auto mb-2" />
					<div className="font-semibold">Presentation</div>
					<div className="text-slate-600">PowerPoint</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg">
					<BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
					<div className="font-semibold">Spreadsheet</div>
					<div className="text-slate-600">Excel</div>
				</div>
				<div className="bg-indigo-50 p-4 rounded-lg">
					<Globe className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
					<div className="font-semibold">Web Browser</div>
					<div className="text-slate-600">Chrome, Safari</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg">
					<Layout className="w-8 h-8 text-red-600 mx-auto mb-2" />
					<div className="font-semibold">Desktop Publishing</div>
					<div className="text-slate-600">Publisher</div>
				</div>
			</div>

			<div className="flex justify-center gap-4">
				<button
					onClick={startGame}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200"
				>
					Start Game
				</button>
			</div>
		</div>
	);

	const renderPlaying = () => {
		if (shuffledScenarios.length === 0) return null;
		const currentScenario = shuffledScenarios[currentScenarioIndex];

		return (
			<div className="w-full max-w-3xl p-8">
				{renderScoreBar()}
				<div className="bg-white p-8 rounded-xl shadow-lg text-center">
					<p className="text-gray-500 font-medium mb-4">
						Question {currentScenarioIndex + 1} of {questionsToAsk}
					</p>
					<p className="text-2xl font-semibold text-slate-700 mb-8">
						{currentScenario.text}
					</p>
					<p className="text-lg text-slate-600 mb-8">
						Which type of software would be most appropriate?
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{currentScenario.choices.map((choice, index) => (
							<button
								key={index}
								onClick={() => handleChoice(choice.isCorrect, choice.feedback)}
								className="bg-slate-100 text-slate-800 font-semibold p-4 rounded-lg shadow-sm hover:bg-slate-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-left"
								type="button"
							>
								{choice.softwareType}
							</button>
						))}
					</div>
				</div>
			</div>
		);
	};

	const renderFeedback = () => {
		if (!lastChoice) return null;
		
		return (
			<div className="w-full max-w-3xl p-8 text-center flex flex-col items-center">
				{renderScoreBar()}
				<div className="bg-white p-8 rounded-xl shadow-lg w-full">
					{lastChoice.isCorrect ? (
						<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
					) : (
						<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					)}
					<h3
						className={`text-3xl font-bold mb-4 flex items-center justify-center gap-2 ${
							lastChoice.isCorrect ? "text-green-600" : "text-red-600"
						}`}
					>
						{getSoftwareIcon(lastChoice.correctSoftware)}
						{lastChoice.isCorrect ? "Correct!" : "Incorrect"}
					</h3>
					<p className="text-xl text-slate-600 mb-4">{lastChoice.feedback}</p>
					<div className="bg-slate-50 p-4 rounded-lg mb-6">
						<p className="text-slate-700 font-medium">Why this is the best choice:</p>
						<p className="text-slate-600 mt-2">{lastChoice.explanation}</p>
					</div>
					<button
						onClick={handleNext}
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200"
					>
						{currentScenarioIndex < questionsToAsk - 1 ? "Next Question" : "See Results"}
					</button>
				</div>
			</div>
		);
	};

	const renderResults = () => {
		const maxScore = questionsToAsk * 10;
		const percentage = Math.round((score / maxScore) * 100);
		
		let resultData;
		if (percentage >= 80) {
			resultData = {
				title: "Software Expert!",
				color: "text-green-600",
				bgColor: "bg-green-50 border-green-500",
				icon: <CheckCircle className="w-20 h-20 mx-auto text-green-600" />,
				message: "Excellent work! You have a strong understanding of when to use different types of software.",
			};
		} else if (percentage >= 60) {
			resultData = {
				title: "Good Knowledge",
				color: "text-blue-600",
				bgColor: "bg-blue-50 border-blue-500",
				icon: <Monitor className="w-20 h-20 mx-auto text-blue-600" />,
				message: "Well done! You have good software knowledge with room for some improvement.",
			};
		} else {
			resultData = {
				title: "Keep Learning",
				color: "text-orange-600",
				bgColor: "bg-orange-50 border-orange-500",
				icon: <HelpCircle className="w-20 h-20 mx-auto text-orange-600" />,
				message: "Keep practicing! Review the different types of software and their best uses.",
			};
		}

		// Get unique incorrect software types for review
		const uniqueIncorrectAnswers = [...new Set(incorrectAnswers)];

		return (
			<div className="text-center p-8 max-w-3xl mx-auto">
				<div className={`bg-white p-8 rounded-xl shadow-2xl border-t-8 ${resultData.bgColor}`}>
					{resultData.icon}
					<h2 className={`text-4xl font-bold mt-4 mb-2 ${resultData.color}`}>
						{resultData.title}
					</h2>
					<p className="text-2xl font-bold text-slate-800 mb-6">
						Final Score: {score}/{maxScore} ({percentage}%)
					</p>
					<p className="text-lg text-slate-600 mb-8">{resultData.message}</p>

					{uniqueIncorrectAnswers.length > 0 && (
						<div className="text-left bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg mb-8">
							<h4 className="font-bold text-xl mb-4 text-amber-800 flex items-center">
								<HelpCircle className="w-6 h-6 mr-2" />
								Areas to review:
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{uniqueIncorrectAnswers.map((software) => (
									<div key={software} className="flex items-center text-amber-700">
										{getSoftwareIcon(software)}
										<span className="ml-2 font-medium">{software} Software</span>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex justify-center gap-4 mt-8">
						<button
							onClick={resetGame}
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200"
						>
							Play Again
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderStage = () => {
		switch (stage) {
			case "intro":
				return renderIntro();
			case "playing":
				return renderPlaying();
			case "feedback":
				return renderFeedback();
			case "results":
				return renderResults();
			default:
				return renderIntro();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
			{renderStage()}
		</div>
	);
};

export default SoftwareIdentificationGame;