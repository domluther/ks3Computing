import { useNavigate } from "@tanstack/react-router";
import {
	BarChart3,
	Blocks,
	CheckCircle,
	FileText,
	Film,
	Globe,
	HelpCircle,
	Image,
	Layout,
	Monitor,
	XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import ScenarioBasedGame, {
	type GameResults,
	type GenericChoice,
	type GenericScenario,
} from "./ScenarioBasedGame";

// --- TYPE DEFINITIONS ---
interface SoftwareChoice extends GenericChoice {
	softwareType: string;
	softwareName: string;
	isCorrect: boolean;
	feedback: string;
}

interface SoftwareScenario extends GenericScenario<SoftwareChoice> {
	explanation: string;
	correctSoftware: string;
}

const SoftwareIdentificationGame = () => {
	const QUESTIONS_TO_ASK = 10;
	const navigate = useNavigate();

	// --- GAME DATA ---
	const scenarios: SoftwareScenario[] = [
		{
			id: 1,
			text: "Your teacher asks you to write a 500-word essay about your summer holidays for homework.",
			choices: [
				{
					softwareType: "Word processing software",
					softwareName: "Microsoft Word",
					isCorrect: true,
					feedback:
						"Perfect! Word processing software is designed for creating, editing and formatting text documents like essays.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"Presentation software is for creating slides, not writing long text documents like essays.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheet software is for working with numbers and data in tables, not writing essays.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback:
						"Graphics software is for creating and editing images, not writing text documents.",
				},
			],
			explanation:
				"Essays require creating, editing and formatting text documents - this is exactly what word processing software does best.",
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
					feedback:
						"Excellent! DTP software combines text and graphics with professional layout tools, perfect for creating eye-catching posters.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"While Word can make basic posters, DTP software has much better design tools and templates for professional-looking results.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Paint",
					isCorrect: false,
					feedback:
						"Graphics software is great for images, but posters need both text and images combined professionally.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint is for on-screen presentations, not printed posters. DTP software is better for this.",
				},
			],
			explanation:
				"Posters require combining text and images with professional layout tools - DTP software specializes in this type of design work.",
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
					feedback:
						"Perfect! Presentation software lets you create slides with images, text and animations to support your talk.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word is for documents, not for creating visual slides to show during a presentation.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback:
						"DTP is for printed materials like posters. Presentation software is better for on-screen slides.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback:
						"Graphics software creates individual images, but you need slides with text and multiple images for a presentation.",
				},
			],
			explanation:
				"Presentations require slides with images, text and possibly animations - this is what presentation software is designed for.",
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
					feedback:
						"Exactly right! Web browsers are designed to open and view web pages from the internet.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word is for creating documents, not for viewing websites on the internet.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheets work with numbers and data, not for browsing websites.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback:
						"Graphics software is for images, not for browsing and reading web content.",
				},
			],
			explanation:
				"Researching online requires web browser software to access and view websites on the internet.",
			correctSoftware: "Web Browser",
		},
		{
			id: 5,
			text: "You need to calculate how much pocket money you'll have saved after 6 months and create a chart showing your progress.",
			choices: [
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: true,
					feedback:
						"Perfect! Spreadsheets excel at calculations and creating charts from numerical data.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word is for text, not calculations. While it can insert charts, spreadsheet software is much better for this.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Paint",
					isCorrect: false,
					feedback:
						"Graphics software creates images, but spreadsheet software is better for charts based on actual data.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Chrome",
					isCorrect: false,
					feedback:
						"Web browsers are for viewing websites, not creating charts from data.",
				},
			],
			explanation:
				"Working with numerical data and creating charts requires spreadsheet software's specialized tools.",
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
					feedback:
						"Excellent! Graphics software has tools specifically designed for editing and enhancing photos.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word can insert photos but doesn't have advanced tools for editing images like removing red-eye.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint has basic image tools, but graphics software has much better photo editing capabilities.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Safari",
					isCorrect: false,
					feedback:
						"Web browsers are for viewing websites, not editing photos.",
				},
			],
			explanation:
				"Photo editing requires specialized tools for adjusting colours, removing red-eye and enhancing images - this is what graphics software provides.",
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
					feedback:
						"Perfect! DTP software is designed for creating professional-looking publications like newsletters with complex layouts.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"While Word can make newsletters, DTP software has better tools for professional multi-column layouts.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint is for slides shown on screen, not for printed publications like newsletters.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheets work with numbers and data, not for creating formatted publications.",
				},
			],
			explanation:
				"Newsletters need professional layout tools for columns, text formatting and image placement - DTP software specializes in this.",
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
					feedback:
						"Excellent! Spreadsheets are perfect for tracking data over time and calculating running totals.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word is for text documents. Spreadsheet software is much better for tracking numbers and calculations.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Paint",
					isCorrect: false,
					feedback:
						"Graphics software is for images, not for tracking financial data and calculations.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint is for presentations. You need spreadsheet software for numerical tracking and calculations.",
				},
			],
			explanation:
				"Tracking money over time and calculating totals requires spreadsheet software's data organization and calculation features.",
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
					feedback:
						"Perfect! Word processing software has templates and formatting tools ideal for creating formal letters.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint is for creating slides for presentations, not for writing formal letters.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Microsoft Edge",
					isCorrect: false,
					feedback:
						"Web browsers are for viewing websites, not creating documents like letters.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Adobe Photoshop",
					isCorrect: false,
					feedback:
						"Graphics software is for creating and editing images, not writing text documents.",
				},
			],
			explanation:
				"Formal letters require proper text formatting, spell-check and document templates - word processing software provides all these features.",
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
					feedback:
						"Correct! You need a web browser to access and view websites on the internet.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word creates documents, but you need a web browser to view websites online.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheets work with data and numbers, not for browsing websites.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback:
						"DTP creates publications, but you need a web browser to access websites.",
				},
			],
			explanation:
				"To access any website, you need web browser software that can connect to the internet and display web pages.",
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
					feedback:
						"Excellent! Graphics software has drawing tools, brushes and colours perfect for creating digital artwork.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word is mainly for text, not for creating detailed digital drawings and artwork.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheets work with numbers and data, not for creating drawings and artwork.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Google Chrome",
					isCorrect: false,
					feedback: "Web browsers view websites, not create digital drawings.",
				},
			],
			explanation:
				"Creating digital art requires specialized drawing tools, brushes and colour palettes that graphics software provides.",
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
					feedback:
						"Perfect! Spreadsheets excel at organizing financial data, calculating totals and creating budgets.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"While you could make a list in Word, spreadsheet software has better tools for calculations and budgets.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint is for creating slides for presentations, not for creating budgets with calculations.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Paint, Photoshop",
					isCorrect: false,
					feedback:
						"Graphics software is for images and artwork, not for financial calculations and budgets.",
				},
			],
			explanation:
				"Budgets involve numbers, calculations and data organization - spreadsheet software is designed specifically for this type of work.",
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
					feedback:
						"Correct! Presentation software lets you create slides with text, images and formatting to showcase information.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word is great for essays, but presentation software is better for creating visual slides.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback:
						"DTP is for printed materials. For on-screen slides, presentation software is more appropriate.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Safari",
					isCorrect: false,
					feedback:
						"Web browsers view websites, not create presentation slides.",
				},
			],
			explanation:
				"Creating slides to display information requires presentation software's slide layout and formatting tools.",
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
					feedback:
						"Excellent! DTP software has templates and design tools perfect for creating attractive printed invitations.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"While Word can make invitations, DTP software has better design tools and templates for this purpose.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheets are for numbers and data, not for creating designed invitations.",
				},
				{
					softwareType: "Web browser",
					softwareName: "MicrosoftEdge",
					isCorrect: false,
					feedback:
						"Web browsers view websites, not create printed invitations.",
				},
			],
			explanation:
				"Creating attractive printed materials like invitations requires DTP software's specialized design and layout tools.",
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
					feedback:
						"Perfect! Web browsers are essential for accessing and reading information on websites.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"You'll use Word to write up your research, but first you need a web browser to access the websites.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint might be used to present your findings, but you need a web browser to research first.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Photoshop",
					isCorrect: false,
					feedback:
						"Graphics software works with images, but you need a web browser to read information online.",
				},
			],
			explanation:
				"Any online research requires web browser software to access and view educational websites on the internet.",
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
						"PowerPoint is for creating slide presentations, not for accessing websites.",
				},
			],
			explanation:
				"To find current information on the internet, you need web browser software to access and view websites.",
			correctSoftware: "Web Browser",
		},
		{
			id: 17,
			text: "For your drama homework, you need to film and edit a short movie trailer based on a play you are studying.",
			choices: [
				{
					softwareType: "Video editing software",
					softwareName: "iMovie, Clipchamp",
					isCorrect: true,
					feedback:
						"Great choice! Video editing software is perfect for cutting clips, adding music and creating titles for a movie trailer.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint is for making slides. You need video editing tools to work with video clips.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Photoshop",
					isCorrect: false,
					feedback:
						"Photoshop is for still images. Video editing software is needed to combine and edit video files.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Chrome",
					isCorrect: false,
					feedback:
						"A web browser lets you watch videos online, but you need special software to edit your own.",
				},
			],
			explanation:
				"Movie trailers involve combining video clips, adding sound effects, music and text titles, which are all key features of video editing software.",
			correctSoftware: "Video Editing",
		},
		{
			id: 18,
			text: "In your computing class, you've been asked to design a simple interactive story where the user can make choices.",
			choices: [
				{
					softwareType: "Programming tools",
					softwareName: "Scratch",
					isCorrect: true,
					feedback:
						"Spot on! Block-based programming tools like Scratch are ideal for creating interactive stories and simple games.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word is for writing linear stories, but it can't handle the interactive choices and logic that programming software can.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"While you can link slides, it's not true programming. Tools like Scratch give you much more control for interactive projects.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback:
						"DTP is for page layout for print, not for creating interactive digital programs.",
				},
			],
			explanation:
				"Creating an interactive story requires programming logic to handle user choices and change the outcome. Block-based tools like Scratch are designed for this.",
			correctSoftware: "Programming",
		},
		{
			id: 19,
			text: "You've recorded several video clips from your family holiday and want to join them together, add background music and share it as a single video.",
			choices: [
				{
					softwareType: "Video editing software",
					softwareName: "iMovie, Clipchamp",
					isCorrect: true,
					feedback:
						"Perfect! Video editing software lets you arrange clips, add a soundtrack and export it all as one movie.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Paint",
					isCorrect: false,
					feedback:
						"Paint is for creating simple drawings. You need video editing software to work with movie files.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheets are for numbers and charts, not for editing video clips.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"You might write a script in Word, but you can't use it to properly edit and combine multiple video files with music.",
				},
			],
			explanation:
				"Combining multiple video files, trimming them and adding a music soundtrack are core tasks of video editing software.",
			correctSoftware: "Video Editing",
		},
		{
			id: 20,
			text: "Your task is to create a simple maze game where a character has to be guided to a goal using the arrow keys.",
			choices: [
				{
					softwareType: "Programming tools",
					softwareName: "Scratch",
					isCorrect: true,
					feedback:
						"Excellent! Tools like Scratch are perfect for learning the basics of game development and creating characters that respond to keyboard input.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Photoshop",
					isCorrect: false,
					feedback:
						"You could design the character in Photoshop, but you need programming software to make it an interactive game.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint can't handle the real-time input and collision detection needed for a maze game.",
				},
				{
					softwareType: "Web browser",
					softwareName: "Safari",
					isCorrect: false,
					feedback:
						"You might play a game in a web browser, but you need programming tools to build one.",
				},
			],
			explanation:
				"Making a game requires programming logic to control a character with key presses and to check if it has reached the goal. This is exactly what tools like Scratch are for.",
			correctSoftware: "Programming",
		},
		{
			id: 21,
			text: "You are helping to run a bake sale for charity and need to create a professional-looking menu with prices and pictures to put on the table.",
			choices: [
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: true,
					feedback:
						"Great! DTP software is best for creating well-designed, single-page documents like menus that combine text and images.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word could do a basic job, but DTP software gives you much more control over the layout to make it look really professional.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"You'd use a spreadsheet to calculate your profits, but not to design the final printed menu.",
				},
				{
					softwareType: "Video editing software",
					softwareName: "iMovie",
					isCorrect: false,
					feedback:
						"Video editing software is for making movies, not for creating printed documents like a menu.",
				},
			],
			explanation:
				"Menus require precise control over the placement of text boxes, images and prices for a visually appealing layout, which is the speciality of DTP software.",
			correctSoftware: "Desktop Publishing",
		},
		{
			id: 22,
			text: "You are writing the script for a short play. It needs to have the character names in bold followed by their lines, and some notes about actions.",
			choices: [
				{
					softwareType: "Word processing software",
					softwareName: "Word, Google Docs",
					isCorrect: true,
					feedback:
						"Exactly. Word processing software is perfect for writing and formatting text-heavy documents like scripts.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"A script is a text document. You might turn it into a presentation later, but you'd write it in a word processor first.",
				},
				{
					softwareType: "Programming tools",
					softwareName: "Scratch",
					isCorrect: false,
					feedback:
						"Scratch is for making interactive programs, not for writing a linear script for actors.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"Spreadsheets are for numbers and data, not for writing dialogue and stage directions.",
				},
			],
			explanation:
				"Writing a script involves a lot of text typing, formatting (like bolding names) and editing, which are the main functions of word processing software.",
			correctSoftware: "Word Processing",
		},
		{
			id: 23,
			text: "You're planning a birthday party for 10 friends. You need to list all the costs (food, decorations, activities) and work out the total cost and the cost per person.",
			choices: [
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: true,
					feedback:
						"Perfect! Spreadsheets are designed for budgeting, listing items and using formulas to calculate totals and averages automatically.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"You could make a list in Word, but you'd have to do the maths yourself. A spreadsheet does all the calculations for you.",
				},
				{
					softwareType: "Desktop Publishing software",
					softwareName: "Publisher",
					isCorrect: false,
					feedback:
						"You would use DTP to design the invitations, but a spreadsheet is the tool for managing the budget.",
				},
				{
					softwareType: "Video editing software",
					softwareName: "Clipchamp",
					isCorrect: false,
					feedback:
						"Video editing software is for making movies, not for planning party finances.",
				},
			],
			explanation:
				"Budgeting requires organizing costs and using formulas to perform calculations (like SUM and AVERAGE), which is the primary purpose of spreadsheet software.",
			correctSoftware: "Spreadsheet",
		},
		{
			id: 24,
			text: "You want to create a new profile picture for your online accounts by combining a photo of yourself with a cool background you found, and adding some text with your username.",
			choices: [
				{
					softwareType: "Graphics software",
					softwareName: "Photoshop, GIMP",
					isCorrect: true,
					feedback:
						"Spot on! Graphics software is ideal for editing photos, cutting out parts of images, combining them in layers and adding stylish text.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint has very basic image tools. Proper graphics software gives you much more power and control for a better result.",
				},
				{
					softwareType: "Word processing software",
					softwareName: "Word",
					isCorrect: false,
					feedback:
						"Word can place images, but it's not designed for advanced editing like cutting out a person from a background.",
				},
				{
					softwareType: "Programming tools",
					softwareName: "Scratch",
					isCorrect: false,
					feedback:
						"Scratch is for making animations and games, not for editing high-quality still images.",
				},
			],
			explanation:
				"Combining images, using layers and applying effects are advanced tasks that require the specialised tools found in graphics software.",
			correctSoftware: "Graphics",
		},
		{
			id: 25,
			text: "Your football coach has asked you to create a short 'highlights reel' of the team's best goals from the season, with slow-motion effects on the best ones.",
			choices: [
				{
					softwareType: "Video editing software",
					softwareName: "iMovie, Clipchamp",
					isCorrect: true,
					feedback:
						"Excellent choice! Video editing software is perfect for cutting together the best clips and applying effects like slow-motion.",
				},
				{
					softwareType: "Presentation software",
					softwareName: "PowerPoint",
					isCorrect: false,
					feedback:
						"PowerPoint is for slide shows and can't be used to edit video clips or add effects like slow-motion.",
				},
				{
					softwareType: "Spreadsheet software",
					softwareName: "Excel",
					isCorrect: false,
					feedback:
						"You might use a spreadsheet to track the scores, but not to create a video of the goals.",
				},
				{
					softwareType: "Graphics software",
					softwareName: "Paint",
					isCorrect: false,
					feedback:
						"Paint is for still images. You need video editing software to work with and add effects to video files.",
				},
			],
			explanation:
				"Creating a highlights reel requires trimming and joining video clips and applying special effects like slow-motion, which are core features of video editing software.",
			correctSoftware: "Video Editing",
		},
	];

	// --- UTILITY FUNCTIONS ---
	const getSoftwareIcon = (software: string): ReactNode => {
		switch (software.toLowerCase()) {
			case "desktop publishing":
				return <Layout className="w-6 h-6" />;
			case "graphics":
				return <Image className="w-6 h-6" />;
			case "presentation":
				return <Monitor className="w-6 h-6" />;
			case "programming":
				return <Blocks className="w-6 h-6" />;
			case "spreadsheet":
				return <BarChart3 className="w-6 h-6" />;
			case "video editing":
				return <Film className="w-6 h-6" />;
			case "web browser":
				return <Globe className="w-6 h-6" />;
			case "word processing":
				return <FileText className="w-6 h-6" />;
			default:
				return <Monitor className="w-6 h-6" />;
		}
	};

	// --- RENDER FUNCTIONS ---
	const choiceRenderer = (
		choice: SoftwareChoice,
		onSelect: () => void,
		_scenario: GenericScenario<SoftwareChoice>,
		index?: number,
	) => (
		<button
			key={choice.softwareType}
			onClick={onSelect}
			className="bg-slate-100 text-slate-800 p-4 rounded-lg shadow-sm hover:bg-slate-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-left flex items-start gap-3"
			type="button"
		>
			{index !== undefined && (
				<span className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
					{index + 1}
				</span>
			)}
			<div className="flex flex-col justify-center flex-1">
				<span className="font-semibold text-base">{choice.softwareType}</span>
				<span className="text-sm text-blue-700 font-normal mt-1">
					(e.g., {choice.softwareName})
				</span>
			</div>
		</button>
	);

	const scoreCalculator = (choice: SoftwareChoice, currentScore: number) => {
		return choice.isCorrect ? currentScore + 10 : currentScore;
	};

	const scoreRenderer = (score: number) => {
		const maxScore = QUESTIONS_TO_ASK * 10;
		const percentage = (score / maxScore) * 100;

		return (
			<div className="w-full max-w-3xl bg-slate-200 rounded-full h-8 mb-6 shadow-inner relative">
				<div
					className="bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 h-8 rounded-full transition-all duration-500 ease-out"
					style={{ width: `${percentage}%` }}
				></div>
				<span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-800 drop-shadow-sm">
					Score: {score}/{maxScore}
				</span>
			</div>
		);
	};

	const feedbackRenderer = (
		choice: SoftwareChoice,
		_scoreChange: number,
		scenario: GenericScenario<SoftwareChoice>,
	) => {
		const softwareScenario = scenario as SoftwareScenario;
		return (
			<div className="text-center">
				{choice.isCorrect ? (
					<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
				) : (
					<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
				)}
				<h3
					className={`text-3xl font-bold mb-4 flex items-center justify-center gap-2 ${
						choice.isCorrect ? "text-green-600" : "text-red-600"
					}`}
				>
					{getSoftwareIcon(softwareScenario.correctSoftware)}
					{choice.isCorrect ? "Correct!" : "Incorrect"}
				</h3>
				<p className="text-xl text-slate-600 mb-4">{choice.feedback}</p>
				<div className="bg-slate-50 p-4 rounded-lg mb-6">
					<p className="text-slate-700 font-medium">
						Why this is the best choice:
					</p>
					<p className="text-slate-600 mt-2">{softwareScenario.explanation}</p>
				</div>
			</div>
		);
	};

	const resultAnalyzer = (
		finalScore: number,
		allChoices: Array<{
			scenario: GenericScenario<SoftwareChoice>;
			choice: SoftwareChoice;
			scoreChange: number;
		}>,
	): GameResults<SoftwareChoice> => {
		const correctAnswers = allChoices.filter((c) => c.choice.isCorrect);
		const incorrectAnswers = allChoices.filter((c) => !c.choice.isCorrect);

		return {
			finalScore,
			allChoices,
			summary: {
				totalQuestions: allChoices.length,
				correctCount: correctAnswers.length,
				incorrectCount: incorrectAnswers.length,
				percentage: Math.round(
					(correctAnswers.length / allChoices.length) * 100,
				),
				incorrectSoftwareTypes: incorrectAnswers.map(
					(c) => (c.scenario as SoftwareScenario).correctSoftware,
				),
			},
		};
	};

	const resultsRenderer = (results: GameResults<SoftwareChoice>) => {
		const { finalScore, summary } = results;
		const maxScore = results.allChoices.length * 10;
		const percentage = summary.percentage || 0;

		type ResultData = {
			title: string;
			color: string;
			bgColor: string;
			icon: ReactNode;
			message: string;
		};

		let resultData: ResultData;

		if (percentage >= 80) {
			resultData = {
				title: "Software Expert!",
				color: "text-green-600",
				bgColor: "bg-green-50 border-green-500",
				icon: <CheckCircle className="w-20 h-20 mx-auto text-green-600" />,
				message:
					"Excellent work! You have a strong understanding of when to use different types of software.",
			};
		} else if (percentage >= 60) {
			resultData = {
				title: "Good Knowledge",
				color: "text-blue-600",
				bgColor: "bg-blue-50 border-blue-500",
				icon: <Monitor className="w-20 h-20 mx-auto text-blue-600" />,
				message:
					"Well done! You have good software knowledge with room for some improvement.",
			};
		} else {
			resultData = {
				title: "Keep Learning",
				color: "text-orange-600",
				bgColor: "bg-orange-50 border-orange-500",
				icon: <HelpCircle className="w-20 h-20 mx-auto text-orange-600" />,
				message:
					"Don't worry! Understanding software takes practice. Review the different types and try again.",
			};
		}

		const uniqueIncorrectAnswers = Array.from(
			new Set(summary.incorrectSoftwareTypes || []),
		);

		return (
			<div className="text-center space-y-6">
				<div
					className={`bg-white p-8 rounded-xl shadow-2xl border-t-8 ${resultData.bgColor.split(" ")[1]}`}
				>
					<div className={resultData.color}>{resultData.icon}</div>
					<h2 className={`text-4xl font-bold mt-4 mb-2 ${resultData.color}`}>
						{resultData.title}
					</h2>
					<p className="text-2xl font-bold text-slate-800 mb-6">
						Score: {finalScore}/{maxScore} ({percentage}%)
					</p>
					<p className="text-lg text-slate-600 mb-8">{resultData.message}</p>

					<div className="grid grid-cols-2 gap-4 text-center mb-6">
						<div className="bg-green-50 p-4 rounded-lg">
							<div className="text-2xl font-bold text-green-600">
								{summary.correctCount}
							</div>
							<div className="text-green-800">Correct</div>
						</div>
						<div className="bg-red-50 p-4 rounded-lg">
							<div className="text-2xl font-bold text-red-600">
								{summary.incorrectCount}
							</div>
							<div className="text-red-800">Incorrect</div>
						</div>
					</div>

					{uniqueIncorrectAnswers.length > 0 && (
						<div className="text-left bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg mb-6">
							<h4 className="font-bold text-xl mb-4 text-amber-800 flex items-center">
								<HelpCircle className="w-6 h-6 mr-2" />
								Areas to review:
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{uniqueIncorrectAnswers.map((software) => (
									<div
										key={software as string}
										className="flex items-center text-amber-700"
									>
										{getSoftwareIcon(software as string)}
										<span className="ml-2 font-medium">
											{software as string} Software
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<ScenarioBasedGame
				title="Software Identification Game"
				description={
					<>
						<p className="mb-4">
							Test your knowledge of different types of software! You'll read
							scenarios and then need to pick the most appropriate software for
							each task.
						</p>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 text-sm">
							<div className="bg-blue-50 p-4 rounded-lg">
								<FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
								<div className="font-semibold">Word Processing</div>
								<div className="text-slate-600">Word, Docs</div>
							</div>
							<div className="bg-green-50 p-4 rounded-lg">
								<Image className="w-8 h-8 text-green-600 mx-auto mb-2" />
								<div className="font-semibold">Graphics</div>
								<div className="text-slate-600">Paint, Photoshop</div>
							</div>
							<div className="bg-purple-50 p-4 rounded-lg">
								<Monitor className="w-8 h-8 text-purple-600 mx-auto mb-2" />
								<div className="font-semibold">Presentation</div>
								<div className="text-slate-600">PowerPoint, Slides</div>
							</div>
							<div className="bg-orange-50 p-4 rounded-lg">
								<BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
								<div className="font-semibold">Spreadsheet</div>
								<div className="text-slate-600">Excel, Sheets</div>
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
							<div className="bg-cyan-50 p-4 rounded-lg">
								<Film className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
								<div className="font-semibold">Video Editing</div>
								<div className="text-slate-600">iMovie, Clipchamp</div>
							</div>
							<div className="bg-lime-50 p-4 rounded-lg">
								<Blocks className="w-8 h-8 text-lime-600 mx-auto mb-2" />
								<div className="font-semibold">Programming</div>
								<div className="text-slate-600">Scratch, Thonny</div>
							</div>{" "}
						</div>
					</>
				}
				scenarios={scenarios}
				initialScore={0}
				questionsToAsk={QUESTIONS_TO_ASK}
				choiceRenderer={choiceRenderer}
				scoreCalculator={scoreCalculator}
				resultAnalyzer={resultAnalyzer}
				scoreRenderer={scoreRenderer}
				feedbackRenderer={feedbackRenderer}
				resultsRenderer={resultsRenderer}
				onNavigateHome={() => navigate({ to: "/" })}
			/>
		</div>
	);
};

export default SoftwareIdentificationGame;
