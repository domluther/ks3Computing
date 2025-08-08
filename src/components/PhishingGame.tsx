import { useNavigate } from "@tanstack/react-router";
import {
	AlertTriangle,
	AtSign,
	CheckCircle,
	Fish,
	Mail,
	Shield,
	User,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import GameButton from "../components/GameButton";
import { shuffleArray } from "../utils/utils";

// --- GAME CONFIGURATION ---
const EMAILS_PER_GAME = 10;

// --- PHISHING GAME COMPONENT ---
const PhishingGame = () => {
	const navigate = useNavigate();

	// --- TYPE DEFINITIONS ---
	type GameStage = "intro" | "playing" | "identifying" | "feedback" | "results";
	type EmailType = "phishing" | "legitimate";

	interface ClickableClue {
		text: string;
		isSuspicious: boolean;
		reason: string;
		url?: string; // If present, this clue is a link
	}

	interface Email {
		id: number;
		type: EmailType;
		fromName: ClickableClue;
		fromEmail: ClickableClue;
		subject: ClickableClue;
		body: ClickableClue[];
	}

	// --- STATE MANAGEMENT ---
	const [stage, setStage] = useState<GameStage>("intro");
	const [userName, setUserName] = useState("Player");
	const [userEmail, setUserEmail] = useState("player@example.com");
	const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
	const [shuffledEmails, setShuffledEmails] = useState<Email[]>([]);
	const [feedback, setFeedback] = useState({
		title: "",
		message: "",
		correct: false,
	});
	const [identifiedClues, setIdentifiedClues] = useState<string[]>([]);
	const [wrongClueId, setWrongClueId] = useState<string | null>(null);
	const [correctlyIdentifiedEmails, setCorrectlyIdentifiedEmails] = useState(0);
	const [successfullyFoundClues, setSuccessfullyFoundClues] = useState(0);

	// --- GAME DATA FACTORY ---
	const getEmails = (name: string, email: string): Email[] => [
		// --- Existing Emails ---
		{
			id: 1,
			type: "phishing",
			fromName: { text: "Super Offers", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "winner@luckymail.net",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "CONGRATULATIONS! You've Won a New iPhone 16 Pro!",
				isSuspicious: true,
				reason:
					"Unexpected prize notifications that create extreme urgency are highly suspicious.",
			},
			body: [
				{
					text: `Dear ${email},`,
					isSuspicious: true,
					reason:
						"They used your email address instead of your name. Legitimate companies usually use your real name.",
				},
				{
					text: "You have been selected as our lucky winner of a brand new iPhone 16 Pro!",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "To claim your prize, you must click here to verify your details immediately.",
					isSuspicious: true,
					reason:
						"Pressure to click a link to a suspicious URL is a common tactic.",
					url: "http://verify-details-now.com/winner",
				},
				{
					text: "This offer is only valid for 24 hours so act fast!",
					isSuspicious: true,
					reason:
						"Creating a sense of urgency is designed to make you panic and not think carefully.",
				},
				{
					text: "Thank's,\nThe Super Offers Team",
					isSuspicious: true,
					reason:
						"Apostrophe misuse ('Thank's' instead of 'Thanks') is a common grammar error in phishing emails.",
				},
			],
		},
		{
			id: 2,
			type: "legitimate",
			fromName: { text: "Mrs. Davison", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "library@sandbachhigh.co.uk",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Overdue Library Book Reminder",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: `Hi ${name},`, isSuspicious: false, reason: "" },
				{
					text: "Just a friendly reminder that your library book, 'The Hobbit', was due back last Friday.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Please can you return it to the library as soon as possible so another student can borrow it.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "No worries about any fines, just bring it back when you can!",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Thanks,\nMrs. Davison\nSchool Librarian",
					isSuspicious: false,
					reason: "",
				},
			],
		},
		{
			id: 3,
			type: "phishing",
			fromName: {
				text: "Micro-soft Account Team",
				isSuspicious: true,
				reason:
					"The sender's name 'Micro-soft' is misspellt. Scammers often use slightly incorrect names to trick you.",
			},
			fromEmail: {
				text: "security@microsft.com",
				isSuspicious: true,
				reason:
					"The sender's email 'microsft.com' is misspellt. Legitimate companies have correct spelling.",
			},
			subject: {
				text: "Urgent: Unusual Sign-in Activity",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: `Hi ${name},`, isSuspicious: false, reason: "" },
				{
					text: "We detected an unusual sign-in to your account from a new location.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "If this wasn't you, please reset your pasword immediately to secure your account.",
					isSuspicious: true,
					reason:
						"Spelling mistakes like 'pasword' are a red flag. Professional companies check their emails for errors.",
				},
				{
					text: "If you don't do this, your account will be locked in 1 hour.",
					isSuspicious: true,
					reason:
						"Threatening to lock your account is a way to make you rush into a bad decision.",
				},
				{ text: "Thank you", isSuspicious: false, reason: "" },
			],
		},
		{
			id: 4,
			type: "legitimate",
			fromName: { text: "Mr. Luther", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "dluther@sandbachhigh.co.uk",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Computing Homework - Algorithms",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: `Hello ${name},`, isSuspicious: false, reason: "" },
				{ text: "Thank you for the email.", isSuspicious: false, reason: "" },
				{
					text: "I'm just confirming that the Quiz It homework on algorithms is due in this Friday. If you've lost your sheet come to S7 for a spare copy.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Let me know if you have any questions.",
					isSuspicious: false,
					reason: "",
				},
				{ text: "Best wishes,\nMr. Luther", isSuspicious: false, reason: "" },
			],
		},
		{
			id: 5,
			type: "phishing",
			fromName: { text: "IT Support", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "help@sandbachhigh.co.uk.info",
				isSuspicious: true,
				reason:
					"The sender's email address ends in '.co.uk.info'. This is not the official school email address, which is a major warning sign.",
			},
			subject: {
				text: "Your School Storage is Almost Full",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{
					text: "Dear Student,",
					isSuspicious: true,
					reason:
						"A generic greeting like 'Dear Student' is suspicious. A real email from school would likely use your name.",
				},
				{
					text: "Your home drive is 90% full. You will not be able to save your work soon.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "To avoid disruption, please log in to the website below to upgrade to a larger storage plan for free.",
					isSuspicious: true,
					reason:
						"An unexpected request to log in via a link can be a trick to steal your password. Go to the official website yourself instead.",
					url: "http://sandbach-login.com/storage",
				},
				{
					text: "Failure to do so may result in loose of files.",
					isSuspicious: true,
					reason:
						"Spelling mistakes like 'loose' instead of 'loss' are a big red flag.",
				},
			],
		},
		{
			id: 6,
			type: "phishing",
			fromName: { text: "Royal Mail", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "track@royalmail-gb.com",
				isSuspicious: true,
				reason:
					"This email domain looks real but isn't the official one ('royalmail.com'). Scammers use similar domains to trick you.",
			},
			subject: {
				text: "Your parcel is waiting for delivery",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{
					text: "Hello,",
					isSuspicious: true,
					reason:
						"A generic greeting is suspicious. They would usually use your name if they had it.",
				},
				{
					text: "We were unable to deliver your parcel today. A small redelivery fee of £1.99 is required.",
					isSuspicious: true,
					reason: "Royal Mail do not charge you a redelivery fee.",
				},
				{
					text: "Please pay this fee by visiting our secure portal.",
					isSuspicious: true,
					reason:
						"Unexpected requests for payment, even small ones, are a huge red flag.",
					url: "http://royalmail-portal.co.uk/pay",
				},
				{
					text: "Your parcel will be returned too the sender if the fee is not paid in 2 days.",
					isSuspicious: true,
					reason:
						"Using the wrong word ('too' instead of 'to') is a sign of a poorly written, unprofessional email.",
				},
			],
		},
		{
			id: 7,
			type: "legitimate",
			fromName: { text: "Mr. Jones", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "d.jones@sandbachhigh.co.uk",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Film Club this Thursday",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: `Hi everyone,`, isSuspicious: false, reason: "" },
				{
					text: "A quick reminder that Film Club is on this Thursday after school in G8Way2.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "We'll be watching 'Duck Tales'. Hope to see you there!",
					isSuspicious: false,
					reason: "",
				},
				{ text: "Mr. Jones", isSuspicious: false, reason: "" },
			],
		},
		{
			id: 8,
			type: "phishing",
			fromName: {
				text: "Instagran",
				isSuspicious: true,
				reason: "The name is misspellt as 'Instagran' instead of 'Instagram'.",
			},
			fromEmail: {
				text: "login@instagran.net",
				isSuspicious: true,
				reason:
					"The domain is 'instagran.net', not the official 'instagram.com'.",
			},
			subject: {
				text: "Instagram Password Reset Request",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{
					text: "Someone tried to log in to your account from an unrecognised device.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "If this was you, you can ignore this email.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "If this wasn't you, secure you're account here.",
					isSuspicious: true,
					reason:
						"This link goes to a fake website designed to steal your password and they wrote 'you're account'.",
					url: "http://instagran-secure.com/reset",
				},
				{
					text: "Thanks,\nInstagran Support Team",
					isSuspicious: true,
					reason:
						"The sign-off is generic and doesn't match the official communication style.",
				},
			],
		},
		{
			id: 9,
			type: "phishing",
			fromName: {
				text: "Sandbach High School",
				isSuspicious: false,
				reason: "",
			},
			fromEmail: {
				text: "noreply@sandbachigh.co.uk",
				isSuspicious: true,
				reason:
					"The domain 'sandbachigh' is misspellt. A real school email would come from 'sandbachhigh.co.uk'.",
			},
			subject: { text: "Weekly Newsletter", isSuspicious: false, reason: "" },
			body: [
				{ text: "Dear Parents and Students,", isSuspicious: false, reason: "" },
				{
					text: "Welcome to this week's newsletter.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "You can read about our recent charity bake sale and see upcoming dates for your diary on the school website.",
					isSuspicious: true,
					reason:
						"Hovering over the link reveals a misspellt domain. Always check links before you click.",
					url: "https://www.sandbachigh.co.uk/news",
				},
				{
					text: "Have a great weekend!\n Bob Bobberson",
					isSuspicious: true,
					reason:
						"A generic or unusual sign-off can be a red flag. Official school communications usually have a clear, professional closing.",
				},
			],
		},
		{
			id: 10,
			type: "phishing",
			fromName: { text: "School Payments", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "admin@sandbachhigh-school.com",
				isSuspicious: true,
				reason:
					"The domain 'sandbachhigh-school.com' is very close to the real one, but the extra hyphen is a giveaway that it's a fake.",
			},
			subject: {
				text: "Payment Required for School Trip",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{
					text: "Dear Parent/Guardian,",
					isSuspicious: true,
					reason: "A generic greeting is often used in phishing emails.",
				},
				{
					text: "A payment of £25 is required for the upcoming Geography trip.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Please submit payment by the end of today to secure your childs place.",
					isSuspicious: true,
					reason:
						"Grammar mistakes like a missing apostrophe in 'childs' are unprofessional and suspicious.",
				},
				{
					text: "Pay now via our secure online portal.",
					isSuspicious: true,
					reason:
						"This link leads to a fake payment site to steal card details.",
					url: "https://www.sandbach-payments.co/trip",
				},
				{
					text: "Cheers \nThe Admin Team",
					isSuspicious: true,
					reason: "This is too informal for a school communication.",
				},
			],
		},
		{
			id: 11,
			type: "phishing",
			fromName: { text: "Your Bank PLC", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "security-alert@yourbank.co.uk.net",
				isSuspicious: true,
				reason:
					"Scammers often add extra endings like '.net' to a real domain to make it look legitimate.",
			},
			subject: {
				text: "Action Required: Your Account has been Suspended",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{
					text: "Dear Valued Customer,",
					isSuspicious: true,
					reason:
						"Banks will almost always address you by your full name, not a generic title.",
				},
				{
					text: "For you're protection, we have temporarily suspended your account due to suspicious activity.",
					isSuspicious: true,
					reason:
						"Using the wrong word ('you're' instead of 'your') is a clear sign of an unprofessional, and likely malicious, email.",
				},
				{
					text: "log in immediately to reactivate your account and stop your money getten taking.",
					isSuspicious: true,
					reason:
						"Poor English and this link leads to a fake login page designed to steal your bank details.",
					url: "http://yourbank-login-portal.com/auth",
				},
			],
		},
		{
			id: 12,
			type: "legitimate",
			fromName: { text: "Team History", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "team.history@sandbachhigh.co.uk",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Year 10 History Trip to Chester - Update",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: `Hi ${name},`, isSuspicious: false, reason: "" },
				{
					text: "Just a quick update about our trip next Tuesday. The coach will be leaving from the front of school at 8:45 AM sharp, so please be there by 8:30 AM.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Remember to bring a packed lunch and some water. You can find the full itinerary on the school website.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "See you then,\nTeam History",
					isSuspicious: false,
					reason: "",
				},
			],
		},
		{
			id: 13,
			type: "phishing",
			fromName: { text: "Accounts Payable", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "invoice@quickbooks-online.co",
				isSuspicious: true,
				reason:
					"A legitimate domain for a UK business would likely be '.com' or '.co.uk', not just '.co'.",
			},
			subject: {
				text: "Invoice INV-0876 Due",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{
					text: "Hi there,",
					isSuspicious: true,
					reason:
						"A real invoice email would likely be addressed to a specific person or company name.",
				},
				{
					text: "Attached is invoice INV-0876 for payment. This payment is now overdue.",
					isSuspicious: true,
					reason:
						"Receiving an unexpected invoice or attachment is a common phishing tactic.",
				},
				{
					text: "Please remit payment immediatly to avoid more late fees or closing account.",
					isSuspicious: true,
					reason:
						"Spelling mistakes like 'immediatly' are a major red flag in a professional email.",
				},
				{
					text: "Click here to view and pay the invoice.",
					isSuspicious: true,
					reason:
						"This link points to a non-official website to trick you into entering payment information.",
					url: "http://qb-pay-portal.com/inv-0876",
				},
			],
		},
		{
			id: 14,
			type: "legitimate",
			fromName: { text: "IT Services", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "it.services@sandbachhigh.co.uk",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Planned Network Maintenance this Weekend",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: "Hello all,", isSuspicious: false, reason: "" },
				{
					text: "Please be aware that we will be performing essential network maintenance this Saturday between 8 AM and 12 PM.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "During this time, access to the school network, including shared drives and some online services, may be intermittent.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "We apologise for any inconvenience this may cause.\n\nRegards,\nThe IT Team",
					isSuspicious: false,
					reason: "",
				},
			],
		},
		{
			id: 15,
			type: "legitimate",
			fromName: { text: "Mrs. Palin", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "j.palin@sandbachhigh.co.uk",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Careers Fair - Next Week!",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: "Dear students,", isSuspicious: false, reason: "" },
				{
					text: "Don't forget that the annual Careers Fair is taking place in the school hall next Wednesday afternoon.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "We have representatives from lots of local businesses, colleges, and apprenticeship programs attending. It's a great opportunity to explore your options for the future.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Hope to see you all there!\nMrs. Palin",
					isSuspicious: false,
					reason: "",
				},
			],
		},
		{
			id: 16,
			type: "legitimate",
			fromName: { text: "Vortex Games", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "noreply@vortex-games.com",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "New achievement unlocked: First Quest!",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: `Hey ${name},`, isSuspicious: false, reason: "" },
				{
					text: "Congrats on completing the 'Goblin's Cave' quest and unlocking your first achievement!",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Keep exploring the world of Eldoria. See what's next on your journey!",
					isSuspicious: false,
					reason: "",
				},
				{ text: "The Vortex Team", isSuspicious: false, reason: "" },
			],
		},
		{
			id: 17,
			type: "phishing",
			fromName: {
				text: "FaceGram",
				isSuspicious: true,
				reason:
					"Scammers often invent names that sound like popular social media sites.",
			},
			fromEmail: {
				text: "friend-requests@facegram.social",
				isSuspicious: true,
				reason:
					"Using unusual domain endings like '.social' is a tactic to look modern, but it's not from an official site.",
			},
			subject: {
				text: "You have 1 new freind request",
				isSuspicious: true,
				reason:
					"Spelling mistakes like 'freind' are a major giveaway of a phishing attempt.",
			},
			body: [
				{
					text: "Hi, a person you may know wants to be your freind on FaceGram.",
					isSuspicious: true,
					reason:
						"Repeating the 'freind' spelling mistake shows a lack of care.",
				},
				{
					text: "View the request hear to accept or decline.",
					isSuspicious: true,
					reason:
						"Using the wrong word ('hear' instead of 'here') is another common grammatical error in scam emails.",
					url: "http://facegram.social/accept-now",
				},
				{
					text: "This link will expire in one hour.",
					isSuspicious: true,
					reason:
						"Creating urgency is a key tactic to make you click without thinking.",
				},
			],
		},
		{
			id: 18,
			type: "legitimate",
			fromName: { text: "Code Club", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "hello@codeclub.org",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Your new project awaits!",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: "Hi,", isSuspicious: false, reason: "" },
				{
					text: "Welcome to Code Club! We're so excited to have you.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Your first project, 'Scratch Cat Animator', is ready for you to start. Just log in to your account on the Code Club website to get started.",
					isSuspicious: false,
					reason: "",
				},
				{ text: "Happy coding!", isSuspicious: false, reason: "" },
			],
		},
		{
			id: 19,
			type: "phishing",
			fromName: {
				text: "GameCoinz",
				isSuspicious: true,
				reason:
					"Made-up company names that promise free stuff are almost always a scam.",
			},
			fromEmail: {
				text: "free@game-coinz.xyz",
				isSuspicious: true,
				reason:
					"The '.xyz' domain is uncommon and often used for spam or scams.",
			},
			subject: {
				text: "FREE 5,000 ROBUX FOR YOU!",
				isSuspicious: true,
				reason:
					"Offers that are too good to be true, using all caps and exclamation marks, are classic signs of a scam.",
			},
			body: [
				{
					text: "Hello Gamer!",
					isSuspicious: true,
					reason:
						"Using a generic term like 'Gamer' instead of your actual username is suspicious.",
				},
				{
					text: "You have been selected to recieve 5,000 free Robux!",
					isSuspicious: true,
					reason:
						"Spelling mistakes like 'recieve' are unprofessional. Also, legitimate giveaways are rarely sent via unsolicited email.",
				},
				{
					text: "To get your Robux, you must verify you're account on our secure portal.",
					isSuspicious: true,
					reason:
						"Grammar mistakes ('you're' instead of 'your') and requests to 'verify' an account on a strange site are huge red flags.",
					url: "http://get-robux-now-real.net",
				},
			],
		},
		{
			id: 20,
			type: "legitimate",
			fromName: { text: "YouTube Support", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "notifications@youtube.com",
				isSuspicious: false,
				reason: "",
			},
			subject: {
				text: "Your video upload is complete",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{ text: "Hello Creator,", isSuspicious: false, reason: "" },
				{
					text: "Good news! Your video, 'My Awesome Minecraft Build', has finished processing and is now live.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Remember that all uploads must follow our community guidelines.",
					isSuspicious: false,
					reason: "",
				},
				{
					text: "Thanks for sharing,\nThe YouTube Team",
					isSuspicious: false,
					reason: "",
				},
			],
		},
		{
			id: 21,
			type: "phishing",
			fromName: { text: "YT Giveaways", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "winner@youtubegiveaway.co",
				isSuspicious: true,
				reason:
					"The '.co' domain can be legitimate, but in this context, it's likely trying to imitate '.com'.",
			},
			subject: {
				text: "YOU WON! Claim Your Prize Now!",
				isSuspicious: true,
				reason:
					"Unexpected prize notifications that create extreme urgency are highly suspicious.",
			},
			body: [
				{
					text: "CONGRATULATIONS! You have won our latest influencer giveaway! The prize is a new gaming PC.",
					isSuspicious: true,
					reason: "Winning a contest you never entered is a classic scam.",
				},
				{
					text: "To claim, you must provide you're shipping details and pay a small £5.99 insurance fee.",
					isSuspicious: true,
					reason:
						"Legitimate prizes don't require you to pay a fee. This is a trick to get your card details.",
					url: "http://yt-giveaway-prizes.com/claim",
				},
				{
					text: "This must be done within 24 hours or we will select another winner.",
					isSuspicious: true,
					reason:
						"High pressure tactics are used to stop you from thinking carefully.",
				},
			],
		},
		{
			id: 22,
			type: "phishing",
			fromName: { text: "Google Docs", isSuspicious: false, reason: "" },
			fromEmail: {
				text: "sharing-noreply@goooogle.com",
				isSuspicious: true,
				reason:
					"A misspellt domain like 'goooogle.com' is one of the most common and effective tricks scammers use.",
			},
			subject: {
				text: "A document has been shared with you",
				isSuspicious: false,
				reason: "",
			},
			body: [
				{
					text: `Hi, a document titled 'IMPORTANT: Class List' has been shared with you by a teacher.`,
					isSuspicious: false,
					reason: "",
				},
				{
					text: "To view this document, please sign in with your school account.",
					isSuspicious: true,
					reason:
						"This link will lead to a fake login page to steal your school username and password.",
					url: "http://goooogle-docs-login.com/auth",
				},
				{
					text: "If you do not view this document your access may be restircted.",
					isSuspicious: true,
					reason:
						"Spelling errors ('restircted') and threats are signs of a phishing email.",
				},
			],
		},
	];

	// --- GAME LOGIC ---
	const startGame = () => {
		const allEmails = getEmails(userName, userEmail);
		const gameEmails = shuffleArray(allEmails).slice(0, EMAILS_PER_GAME);

		setShuffledEmails(gameEmails);
		setCurrentEmailIndex(0);
		setIdentifiedClues([]);
		setCorrectlyIdentifiedEmails(0);
		setSuccessfullyFoundClues(0);
		setStage("playing");
	};

	const handleInitialChoice = (choice: EmailType) => {
		const email = shuffledEmails[currentEmailIndex];
		const isCorrect = choice === email.type;

		if (isCorrect) {
			setCorrectlyIdentifiedEmails((prev) => prev + 1);
			if (email.type === "phishing") {
				setStage("identifying");
			} else {
				setFeedback({
					title: "Correct!",
					message:
						"Well done! This was a legitimate email. You're getting good at telling the difference.",
					correct: true,
				});
				setStage("feedback");
			}
		} else {
			if (email.type === "legitimate") {
				setFeedback({
					title: "Incorrect",
					message:
						"This email was actually safe. Legitimate emails come from official addresses and are usually well-written.",
					correct: false,
				});
			} else {
				setFeedback({
					title: "Oh no!",
					message:
						"This was a phishing email. It had several clues that it was a fake. Let's look at what they were.",
					correct: false,
				});
			}
			setStage("feedback");
		}
	};

	const handleClueClick = (clue: ClickableClue) => {
		if (clue.isSuspicious) {
			if (!identifiedClues.includes(clue.reason)) {
				setIdentifiedClues((prev) => [...prev, clue.reason]);
			}
		} else {
			setWrongClueId(clue.text);
			setTimeout(() => {
				setWrongClueId(null);
			}, 1500);
		}
	};

	const finishIdentifying = () => {
		const email = shuffledEmails[currentEmailIndex];
		const allClues = [
			email.fromName,
			email.fromEmail,
			email.subject,
			...email.body,
		].filter((p) => p.isSuspicious);
		const totalCluesInEmail = allClues.length;
		const foundCluesCount = identifiedClues.length;

		setSuccessfullyFoundClues((prev) => prev + foundCluesCount);

		setFeedback({
			title: `You found ${foundCluesCount} of ${totalCluesInEmail} clues!`,
			message: `Great job spotting the signs of a phishing attempt.`,
			correct: true,
		});
		setStage("feedback");
	};

	const handleNextEmail = () => {
		if (currentEmailIndex < shuffledEmails.length - 1) {
			setCurrentEmailIndex((prev) => prev + 1);
			setIdentifiedClues([]);
			setWrongClueId(null);
			setStage("playing");
		} else {
			setStage("results");
		}
	};

	const resetGame = () => {
		setStage("intro");
		setUserName("Player");
		setUserEmail("player@example.com");
	};

	// --- UI RENDERING ---
	const renderIntro = () => (
		<div className="text-center p-8 max-w-3xl mx-auto">
			<h2 className="text-4xl font-bold text-slate-800 mb-4">
				Spot the Phish! 🎣
			</h2>
			<p className="text-lg text-slate-600 mb-6">
				Phishing emails try to trick you. In this game, you'll learn how to spot
				them. You'll be shown {EMAILS_PER_GAME} emails—can you tell the real
				from the fake?
			</p>
			<p className="text-sm text-slate-500 mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
				<strong className="flex items-center justify-center mb-2">
					<AlertTriangle className="w-5 h-5 mr-2 text-amber-600" /> A Quick Note
					on Safety
				</strong>
				This game uses a name and email below to make the emails feel real, but{" "}
				<strong className="text-red-600">
					we do not save this information
				</strong>
				. Even so, it's always best practice not to use your real details on
				websites you don't know and trust.
			</p>
			<div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
				<div className="mb-4">
					<label
						htmlFor="name"
						className="flex items-center text-slate-700 font-semibold mb-2"
					>
						<User className="w-5 h-5 mr-2" /> Name
					</label>
					<input
						type="text"
						id="name"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						className="w-full p-2 border border-slate-300 rounded-md"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="email"
						className="flex items-center text-slate-700 font-semibold mb-2"
					>
						<AtSign className="w-5 h-5 mr-2" /> Email Address
					</label>
					<input
						type="email"
						id="email"
						value={userEmail}
						onChange={(e) => setUserEmail(e.target.value)}
						className="w-full p-2 border border-slate-300 rounded-md"
					/>
				</div>
				<GameButton onClick={startGame} className="w-full">
					Start Game{" "}
				</GameButton>
			</div>
			<button
				onClick={() => navigate({ to: "/online-safety" })}
				className="text-slate-600 hover:text-slate-800 font-semibold py-3 px-6 mt-6"
				type="button"
			>
				Back to Hub
			</button>
		</div>
	);

	const renderEmail = (options: {
		isIdentifying?: boolean;
		isFeedback?: boolean;
	}) => {
		const { isIdentifying = false, isFeedback = false } = options;
		const email = shuffledEmails[currentEmailIndex];

		const ClickablePart = ({
			clue,
			children,
		}: {
			clue: ClickableClue;
			children: React.ReactNode;
		}) => {
			const isIdentified = identifiedClues.includes(clue.reason);
			const isWrong = wrongClueId === clue.text;

			const classParts = ["transition-all duration-300 p-1 rounded-md"];

			// Determine highlighting based on the game mode (feedback, identifying, or just viewing)
			if (isFeedback) {
				if (clue.isSuspicious) {
					classParts.push(
						isIdentified
							? "bg-green-100 border-l-4 border-green-500 font-semibold" // Correctly found: Green
							: "bg-amber-100 border-l-4 border-amber-400", // Missed: Amber
					);
				}
			} else if (isIdentifying) {
				classParts.push("cursor-pointer hover:bg-yellow-100");
				if (isIdentified) {
					classParts.push(
						"bg-green-100 border-l-4 border-green-500 font-semibold",
					); // Found during play: Green
				}
				if (isWrong) {
					classParts.push("bg-red-100 border-l-4 border-red-500"); // Clicked a safe part: Red
				}
			}

			const combinedClassName = classParts.join(" ");
			const commonOnClick = isIdentifying
				? (e: React.MouseEvent) => {
						if (clue.url) e.preventDefault();
						handleClueClick(clue);
					}
				: undefined;

			if (clue.url) {
				const linkClasses = "text-blue-600 underline";
				return (
					<a
						href={isIdentifying || isFeedback ? "#" : clue.url}
						title={clue.url}
						onClick={commonOnClick ?? ((e) => e.preventDefault())}
						className={`${combinedClassName} ${linkClasses}`}
					>
						{children}
					</a>
				);
			}

			return (
				<button
					onClick={commonOnClick}
					className={combinedClassName}
					type="button"
				>
					{children}
				</button>
			);
		};

		return (
			<div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-slate-200">
				<div className="p-4 border-b border-slate-200">
					<h3 className="text-xl font-bold text-slate-800">
						<ClickablePart clue={email.subject}>
							{email.subject.text}
						</ClickablePart>
					</h3>
				</div>
				<div className="p-4 border-b border-slate-200 bg-slate-50 text-sm text-slate-600">
					<p>
						<strong>From:</strong>{" "}
						<ClickablePart clue={email.fromName}>
							{email.fromName.text}
						</ClickablePart>{" "}
						&lt;
						<ClickablePart clue={email.fromEmail}>
							{email.fromEmail.text}
						</ClickablePart>
						&gt;
					</p>
					<p>
						<strong>To:</strong> {userName} &lt;{userEmail}&gt;
					</p>
				</div>
				<div className="p-6 space-y-4 text-slate-700">
					{email.body.map((part) => (
						<p key={part.text} className="whitespace-pre-wrap">
							<ClickablePart clue={part}>{part.text}</ClickablePart>
						</p>
					))}
				</div>
				{isIdentifying && (
					<div className="p-4 bg-yellow-50 border-t border-yellow-200 text-center">
						<h4 className="font-bold text-yellow-800">
							Your Mission: Find the Clues!
						</h4>
						<p className="text-yellow-700 mb-4">
							Click on all the parts of the email that look suspicious.
						</p>
						<p className="font-bold text-lg mb-4 text-slate-700">
							Clues Found: {identifiedClues.length}
						</p>
						{wrongClueId && (
							<p className="text-red-600 font-semibold mb-2 animate-pulse">
								That looks safe. Try again!
							</p>
						)}
						<GameButton onClick={finishIdentifying}>
							I've found them all!
						</GameButton>
					</div>
				)}
			</div>
		);
	};

	const renderPlaying = () => (
		<div className="w-full max-w-3xl p-4 md:p-8">
			<p className="text-center text-gray-500 font-medium mb-4">
				Email {currentEmailIndex + 1} of {shuffledEmails.length}
			</p>
			{renderEmail({})}
			<div className="mt-6 text-center">
				<p className="text-xl font-semibold text-slate-700 mb-4">
					Is this a real email or a phishing attempt?
				</p>
				<div className="flex justify-center gap-4">
					<button
						onClick={() => handleInitialChoice("phishing")}
						className="flex items-center justify-center gap-2 text-lg font-bold bg-red-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
						type="button"
					>
						<Fish className="w-6 h-6" />
						Phishing
					</button>
					<button
						onClick={() => handleInitialChoice("legitimate")}
						className="flex items-center justify-center gap-2 text-lg font-bold bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
						type="button"
					>
						<Shield className="w-6 h-6" />
						Legitimate
					</button>
				</div>
			</div>
		</div>
	);

	const renderIdentifying = () => (
		<div className="w-full max-w-3xl p-4 md:p-8">
			<p className="text-center text-gray-500 font-medium mb-4">
				Email {currentEmailIndex + 1} of {shuffledEmails.length}
			</p>
			{renderEmail({ isIdentifying: true })}
		</div>
	);

	const renderFeedback = () => {
		const email = shuffledEmails[currentEmailIndex];
		const allClues = [
			email.fromName,
			email.fromEmail,
			email.subject,
			...email.body,
		].filter((p) => p.isSuspicious && p.reason);

		return (
			<div className="w-full max-w-3xl p-4 md:p-8 text-center flex flex-col items-center gap-6">
				<div
					className={`bg-white p-8 rounded-xl shadow-lg w-full border-t-8 ${feedback.correct ? "border-green-500" : "border-red-500"}`}
				>
					{feedback.correct ? (
						<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
					) : (
						<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					)}
					<h3 className="text-3xl font-bold mb-4">{feedback.title}</h3>
					<p className="text-xl text-slate-600 mb-6">{feedback.message}</p>

					{email.type === "phishing" && (
						<div className="text-left bg-red-50 border-l-4 border-red-400 p-4 rounded-lg my-6">
							<h4 className="font-bold text-lg mb-2 text-red-800">
								The reasons this was a phishing email:
							</h4>
							<ul className="space-y-2 list-disc list-inside text-red-700">
								{allClues.map((clue) => (
									<li
										key={clue.reason}
										className={`${identifiedClues.includes(clue.reason) ? "font-bold" : ""}`}
									>
										{clue.reason}
										{identifiedClues.includes(clue.reason) ? (
											<span className="text-green-700"> (You found this!)</span>
										) : (
											<span className="text-amber-700"> (You missed this)</span>
										)}
									</li>
								))}
							</ul>
						</div>
					)}
					{email.type === "phishing" && (
						<div className="w-full">
							<p className="text-slate-600 font-semibold mb-2">
								Here's a review of the email. Correctly spotted clues are green,
								missed ones are amber.
							</p>
							{renderEmail({ isFeedback: true })}
						</div>
					)}

					<GameButton onClick={handleNextEmail} className="mt-6">
						{currentEmailIndex < shuffledEmails.length - 1
							? "Next Email"
							: "See Results"}
					</GameButton>
				</div>
			</div>
		);
	};

	const renderResults = () => {
		const totalPossibleClues = shuffledEmails.reduce((acc, email) => {
			if (email.type === "phishing") {
				const cluesInEmail = [
					email.fromName,
					email.fromEmail,
					email.subject,
					...email.body,
				].filter((p) => p.isSuspicious);
				return acc + cluesInEmail.length;
			}
			return acc;
		}, 0);

		let emailFeedback = "";
		if (correctlyIdentifiedEmails === EMAILS_PER_GAME) {
			emailFeedback =
				"Perfect score! You have a brilliant eye for telling real emails from fakes.";
		} else if (correctlyIdentifiedEmails >= EMAILS_PER_GAME * 0.7) {
			emailFeedback =
				"Great work! You correctly identified most of the emails.";
		} else {
			emailFeedback =
				"Good start! Some emails tricked you, but practice makes perfect.";
		}

		let clueFeedback = "";
		if (totalPossibleClues > 0) {
			if (successfullyFoundClues >= totalPossibleClues * 0.8) {
				clueFeedback =
					"You're a master detective, spotting almost all the phishing clues!";
			} else if (successfullyFoundClues >= totalPossibleClues * 0.5) {
				clueFeedback =
					"You found a good number of clues, showing you know what to look for.";
			} else {
				clueFeedback =
					"You found some clues, which is great! Reviewing the tips below will help you spot even more next time.";
			}
		} else {
			clueFeedback =
				"No phishing emails were in your set, but you identified all the legitimate ones correctly!";
		}

		return (
			<div className="text-center p-8 max-w-3xl mx-auto">
				<div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-blue-500">
					<Mail className="w-20 h-20 mx-auto text-blue-500" />
					<h2 className="text-4xl font-bold mt-4 mb-2 text-slate-800">
						Game Over!
					</h2>

					<div className="my-8 space-y-4">
						<div className="bg-slate-100 p-4 rounded-lg">
							<p className="text-2xl font-bold text-slate-800">
								{correctlyIdentifiedEmails} / {EMAILS_PER_GAME}
							</p>
							<p className="text-slate-600">Emails Correctly Identified</p>
							<p className="text-sm mt-2 font-medium">{emailFeedback}</p>
						</div>
						<div className="bg-slate-100 p-4 rounded-lg">
							<p className="text-2xl font-bold text-slate-800">
								{successfullyFoundClues} / {totalPossibleClues}
							</p>
							<p className="text-slate-600">Phishing Clues Found</p>
							<p className="text-sm mt-2 font-medium">{clueFeedback}</p>
						</div>
					</div>

					<div className="text-left bg-sky-50 border-t-4 border-sky-400 p-4 rounded-lg my-8">
						<h4 className="font-bold text-lg mb-2 text-sky-800">
							Key Takeaways: 3 Top Tips
						</h4>
						<ul className="space-y-3 list-decimal list-inside text-sky-900">
							<li>
								<strong>Check the Sender:</strong> Look closely at the "From"
								name and email address. Scammers often use misspellt names (like
								'Micro-soft') or strange domains that look almost real (like
								'school.co.uk.net').
							</li>
							<li>
								<strong>Look for Mistakes & Urgency:</strong> Professional
								companies rarely send emails with spelling or grammar errors. Be
								suspicious of messages that pressure you to act "immediately" or
								threaten you with negative consequences.
							</li>
							<li>
								<strong>Hover, Don't Click:</strong> Always hover your mouse
								over links before clicking. A tooltip will show you the real
								website address. If it looks suspicious or doesn't match where
								the link claims to go, don't click it.
							</li>
						</ul>
					</div>

					<div className="flex justify-center gap-4 mt-8">
						<GameButton onClick={resetGame}>Play Again</GameButton>
						<button
							onClick={() => navigate({ to: "/online-safety" })}
							className="text-slate-600 hover:text-slate-800 font-semibold py-3 px-6"
							type="button"
						>
							Back to Hub
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
			case "identifying":
				return renderIdentifying();
			case "feedback":
				return renderFeedback();
			case "results":
				return renderResults();
			default:
				return renderIntro();
		}
	};

	return (
		<div className="w-full flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
			{renderStage()}
		</div>
	);
};

export default PhishingGame;
