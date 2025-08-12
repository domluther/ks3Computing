import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, HelpCircle, XCircle } from "lucide-react";
import ScenarioBasedGame, {
	type GameResults,
	type GenericChoice,
	type GenericScenario,
} from "./ScenarioBasedGame";

// --- TYPE DEFINITIONS ---
interface SocialChoice extends GenericChoice {
	text: string;
	points: number;
	feedback: string;
}

interface SocialScenario extends GenericScenario<SocialChoice> {
	followUpQuestion: string;
}

const SocialCreditGame = () => {
	const QUESTIONS_TO_ASK = 10;
	const navigate = useNavigate();

	// --- GAME DATA ---
	const scenarios: SocialScenario[] = [
		{
			id: 1,
			text: "You see a classmate's embarrassing photo posted in a group chat. What do you do?",
			choices: [
				{
					text: "Share it with another friend for a laugh.",
					points: -25,
					feedback:
						"Sharing embarrassing content is a form of cyberbullying and hurts others.",
				},
				{
					text: "Privately message the person who posted it and ask them to delete it.",
					points: 15,
					feedback:
						"Good choice. Standing up for others, even in private, is a positive action.",
				},
				{
					text: "Screenshot it before it gets deleted.",
					points: -30,
					feedback:
						"Taking screenshots to keep embarrassing content is harmful and wrong.",
				},
				{
					text: "Ignore it completely.",
					points: 5,
					feedback:
						"Not participating is better than spreading it, but you could do more to help.",
				},
			],
			followUpQuestion: "How should we respond to cyberbullying?",
		},
		{
			id: 2,
			text: "A friend asks you to help them hack into someone's social media account to get back at them. What do you do?",
			choices: [
				{
					text: "Help them because they're your friend.",
					points: -40,
					feedback:
						"Helping with hacking is illegal and can get you in serious trouble.",
				},
				{
					text: "Refuse and explain why it's wrong.",
					points: 20,
					feedback:
						"Excellent! True friends help each other make good choices, not bad ones.",
				},
				{
					text: "Tell them to find someone else to help.",
					points: -10,
					feedback:
						"While you didn't help directly, you didn't discourage the harmful behavior.",
				},
				{
					text: "Report their plan to a trusted adult.",
					points: 25,
					feedback:
						"Perfect! Sometimes protecting others means getting help from adults.",
				},
			],
			followUpQuestion:
				"When is it appropriate to report concerning online behavior?",
		},
		{
			id: 3,
			text: "You find out someone has been spreading false rumors about you online. How do you respond?",
			choices: [
				{
					text: "Start spreading rumors about them in return.",
					points: -35,
					feedback:
						"Fighting fire with fire online just creates more drama and hurt.",
				},
				{
					text: "Ask a trusted adult for advice on how to handle it.",
					points: 25,
					feedback:
						"Smart choice! Adults can help you handle difficult situations properly.",
				},
				{
					text: "Confront the person publicly online.",
					points: -15,
					feedback:
						"Public confrontations online often escalate problems instead of solving them.",
				},
				{
					text: "Talk to the person privately to resolve the issue.",
					points: 15,
					feedback:
						"Good approach! Direct, private communication is often the best first step.",
				},
			],
			followUpQuestion: "What are effective ways to handle online conflicts?",
		},
		{
			id: 4,
			text: "Your friend shares a video of someone getting hurt as a 'funny' clip. What's your response?",
			choices: [
				{
					text: "Laugh along and share it with others.",
					points: -30,
					feedback:
						"Finding entertainment in others' pain and spreading it is harmful behavior.",
				},
				{
					text: "Tell your friend you don't find it funny and ask them not to share such content.",
					points: 20,
					feedback:
						"Great! Setting boundaries about harmful content shows good digital citizenship.",
				},
				{
					text: "Just ignore it and say nothing.",
					points: 0,
					feedback:
						"Staying neutral doesn't help, but at least you didn't participate in the harm.",
				},
				{
					text: "Report the content to the platform.",
					points: 25,
					feedback:
						"Excellent! Reporting harmful content helps protect others and maintains community standards.",
				},
			],
			followUpQuestion:
				"How can we promote empathy in our online interactions?",
		},
		{
			id: 5,
			text: "You receive a friend request from someone you don't know who claims to be from your school. What do you do?",
			choices: [
				{
					text: "Accept immediately - they seem friendly.",
					points: -20,
					feedback:
						"Accepting requests from strangers can put your personal information at risk.",
				},
				{
					text: "Check with mutual friends or ask the person questions to verify their identity.",
					points: 15,
					feedback:
						"Good thinking! Verifying identity helps protect you from potential scams or predators.",
				},
				{
					text: "Ignore the request completely.",
					points: 10,
					feedback:
						"Safe approach! When in doubt, it's better to be cautious with unknown contacts.",
				},
				{
					text: "Ask a parent or teacher for advice.",
					points: 20,
					feedback:
						"Excellent! Getting guidance from trusted adults helps you make safer decisions online.",
				},
			],
			followUpQuestion:
				"What safety measures should we take when connecting with others online?",
		},
		{
			id: 6,
			text: "You see a post where someone is threatening to harm themselves. What should you do?",
			choices: [
				{
					text: "Share the post to get more people to help.",
					points: -10,
					feedback:
						"While your intention is good, sharing could violate their privacy. Direct action is better.",
				},
				{
					text: "Comment with advice on how they should feel better.",
					points: 5,
					feedback:
						"Showing care is good, but this situation needs professional help, not amateur advice.",
				},
				{
					text: "Report the post to the platform and contact a trusted adult immediately.",
					points: 30,
					feedback:
						"Perfect! Situations involving self-harm require immediate adult intervention and proper resources.",
				},
				{
					text: "Send them a private message asking if they're okay.",
					points: 10,
					feedback:
						"Showing personal concern is kind, but this serious situation needs adult help.",
				},
			],
			followUpQuestion: "How should we respond to mental health crises online?",
		},
		{
			id: 7,
			text: "Someone posts a mean comment on your photo. How do you handle it?",
			choices: [
				{
					text: "Respond with an even meaner comment.",
					points: -25,
					feedback:
						"Escalating negativity creates more conflict and can hurt your own reputation.",
				},
				{
					text: "Delete their comment and block them.",
					points: 15,
					feedback:
						"Good boundary setting! Removing negativity from your space protects your mental health.",
				},
				{
					text: "Ask your followers to attack the person.",
					points: -35,
					feedback:
						"Organizing harassment is a serious form of cyberbullying and can have legal consequences.",
				},
				{
					text: "Report the comment and document it.",
					points: 20,
					feedback:
						"Smart approach! Keeping records helps if the behavior continues or escalates.",
				},
			],
			followUpQuestion:
				"What are healthy ways to protect yourself from online negativity?",
		},
		{
			id: 8,
			text: "You discover that a friend is being catfished by someone pretending to be a celebrity. What do you do?",
			choices: [
				{
					text: "Mind your own business - it's not your problem.",
					points: -10,
					feedback:
						"Friends look out for each other. Ignoring potential harm isn't good friendship.",
				},
				{
					text: "Gently show them evidence that it's not real and offer support.",
					points: 25,
					feedback:
						"Perfect! Helping friends recognize scams with kindness and evidence is true friendship.",
				},
				{
					text: "Publicly embarrass them by posting about how gullible they are.",
					points: -30,
					feedback:
						"Public humiliation is cruel and will damage your friendship and their trust.",
				},
				{
					text: "Report the fake account to the platform.",
					points: 20,
					feedback:
						"Good action! Reporting fake accounts helps protect not just your friend but others too.",
				},
			],
			followUpQuestion:
				"How can we help friends make better decisions online without being judgmental?",
		},
		{
			id: 9,
			text: "You're invited to a private group chat where people regularly share inappropriate content. What's your choice?",
			choices: [
				{
					text: "Join and participate - everyone else is doing it.",
					points: -40,
					feedback:
						"Following the crowd into inappropriate behavior can have serious consequences for your future.",
				},
				{
					text: "Join but don't participate actively.",
					points: -15,
					feedback:
						"Silent participation still associates you with inappropriate content and normalizes the behavior.",
				},
				{
					text: "Decline the invitation and distance yourself from the group.",
					points: 20,
					feedback:
						"Wise choice! Avoiding situations that compromise your values protects your reputation and future.",
				},
				{
					text: "Report the group to appropriate authorities if content is illegal.",
					points: 30,
					feedback:
						"Excellent! Taking action against illegal content helps protect vulnerable people.",
				},
			],
			followUpQuestion:
				"How do we maintain our values when facing peer pressure online?",
		},
		{
			id: 10,
			text: "You accidentally share personal information about someone else online. What do you do?",
			choices: [
				{
					text: "Hope no one notices and do nothing.",
					points: -20,
					feedback:
						"Ignoring mistakes doesn't fix them and can make the consequences worse.",
				},
				{
					text: "Delete the post immediately and apologize to the person privately.",
					points: 25,
					feedback:
						"Perfect! Quick action and sincere apology show responsibility and respect for others.",
				},
				{
					text: "Delete it but don't tell the person - they might not have seen it.",
					points: 5,
					feedback:
						"While deleting helps, the person deserves to know about the privacy breach.",
				},
				{
					text: "Leave it up but add a comment saying it was an accident.",
					points: -10,
					feedback:
						"Explaining doesn't protect their privacy. The information should be removed immediately.",
				},
			],
			followUpQuestion:
				"How do we respect others' privacy in our digital communications?",
		},
		{
			id: 11,
			text: "Someone tries to get you to meet them in person after chatting online. You've never met them before. What do you do?",
			choices: [
				{
					text: "Agree to meet them alone at a private location.",
					points: -50,
					feedback:
						"This is extremely dangerous! Meeting strangers alone puts you at serious risk.",
				},
				{
					text: "Suggest meeting in a public place with friends present.",
					points: 5,
					feedback:
						"Better than meeting alone, but meeting online strangers still carries significant risks.",
				},
				{
					text: "Decline and discuss the situation with a trusted adult.",
					points: 30,
					feedback:
						"Perfect! Adults can help you assess whether online relationships are safe and legitimate.",
				},
				{
					text: "Block them immediately - any request to meet is suspicious.",
					points: 25,
					feedback:
						"Smart protective instinct! People who quickly push for meetings often have bad intentions.",
				},
			],
			followUpQuestion:
				"What safety precautions should we always take with online relationships?",
		},
		{
			id: 12,
			text: "You find a USB drive in the school hallway. What do you do with it?",
			choices: [
				{
					text: "Plug it into your computer to see what's on it.",
					points: -30,
					feedback:
						"Unknown USB drives can contain malware that damages your computer or steals your data.",
				},
				{
					text: "Turn it in to the school office without examining it.",
					points: 25,
					feedback:
						"Excellent! School staff can handle found items safely and return them to the owner.",
				},
				{
					text: "Post about it on social media asking if anyone lost it.",
					points: 10,
					feedback:
						"Good intention, but this could attract false claims. Official channels are safer.",
				},
				{
					text: "Keep it for yourself since no one claimed it.",
					points: -20,
					feedback:
						"Taking someone else's property is theft, even if you found it.",
				},
			],
			followUpQuestion:
				"How do physical security practices relate to digital safety?",
		},
		{
			id: 13,
			text: "A classmate asks you to share your streaming service password so they can watch shows. What's your response?",
			choices: [
				{
					text: "Share it freely - what could go wrong?",
					points: -25,
					feedback:
						"Sharing passwords violates terms of service and can compromise your account security.",
				},
				{
					text: "Share it but ask them to change it back after.",
					points: -15,
					feedback:
						"Even temporary sharing violates terms of service and creates security risks.",
				},
				{
					text: "Decline and explain the risks of password sharing.",
					points: 20,
					feedback:
						"Good! Protecting your accounts and explaining why helps others learn about security.",
				},
				{
					text: "Suggest they get their own account or ask their parents.",
					points: 25,
					feedback:
						"Perfect! Encouraging legitimate access respects the service's rules and protects your security.",
				},
			],
			followUpQuestion:
				"Why is password security so important in the digital age?",
		},
		{
			id: 14,
			text: "You see someone live-streaming from school without permission, showing other students. What do you do?",
			choices: [
				{
					text: "Join the stream and try to get on camera.",
					points: -20,
					feedback:
						"Participating in unauthorized streaming violates privacy and school policies.",
				},
				{
					text: "Ignore it - it's not your responsibility.",
					points: -5,
					feedback:
						"Bystander inaction allows privacy violations to continue affecting others.",
				},
				{
					text: "Tell the person to stop and explain the privacy concerns.",
					points: 15,
					feedback:
						"Good peer intervention! Explaining consequences can help people make better choices.",
				},
				{
					text: "Report it to a teacher or administrator immediately.",
					points: 25,
					feedback:
						"Excellent! School staff can address policy violations and protect students' privacy rights.",
				},
			],
			followUpQuestion:
				"How do we balance sharing experiences online with respecting others' privacy?",
		},
		{
			id: 15,
			text: "You receive a message claiming you've won a prize but need to provide personal information to claim it. What do you do?",
			choices: [
				{
					text: "Provide the information immediately - you might really win!",
					points: -35,
					feedback:
						"This is likely a scam! Legitimate prizes don't require personal information upfront.",
				},
				{
					text: "Ask your parents or a trusted adult about it first.",
					points: 25,
					feedback:
						"Smart! Adults can help you identify scams and protect your personal information.",
				},
				{
					text: "Provide fake information to see if it's real.",
					points: -10,
					feedback:
						"Even fake information can be used against you. It's better to avoid engagement entirely.",
				},
				{
					text: "Delete the message and block the sender.",
					points: 20,
					feedback:
						"Good protective action! Ignoring scams prevents further targeting.",
				},
			],
			followUpQuestion:
				"How can we recognize and avoid online scams and fraud?",
		},
	];

	// --- RENDER FUNCTIONS ---
	const choiceRenderer = (
		choice: SocialChoice,
		onSelect: () => void,
		_scenario: GenericScenario<SocialChoice>,
		index?: number,
	) => (
		<button
			key={choice.text}
			onClick={onSelect}
			className="bg-slate-100 text-slate-800 font-semibold p-4 rounded-lg shadow-sm hover:bg-slate-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-left flex items-start gap-3"
			type="button"
		>
			{index !== undefined && (
				<span className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
					{index + 1}
				</span>
			)}
			<span className="flex-1">{choice.text}</span>
		</button>
	);

	const scoreCalculator = (choice: SocialChoice, currentScore: number) => {
		return Math.max(0, currentScore + choice.points);
	};

	const scoreRenderer = (score: number) => {
		const maxScore = 800; // Maximum possible score
		const percentage = Math.min(100, Math.max(10, (score / maxScore) * 100));

		return (
			<div className="w-full max-w-3xl bg-slate-200 rounded-full h-8 mb-6 shadow-inner relative">
				<div
					className={`h-8 rounded-full transition-all duration-500 ${
						score >= 400
							? "bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500"
							: score >= 200
								? "bg-gradient-to-r from-blue-500 via-yellow-500 to-orange-500"
								: "bg-gradient-to-r from-blue-500 via-red-500 to-red-700"
					}`}
					style={{ width: `${percentage}%` }}
				></div>
				<span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-800 drop-shadow-sm">
					Social Credit: {score}
				</span>
			</div>
		);
	};

	const feedbackRenderer = (
		choice: SocialChoice,
		_scoreChange: number,
		scenario: GenericScenario<SocialChoice>,
	) => {
		const socialScenario = scenario as SocialScenario;
		const isPositive = choice.points >= 0;
		return (
			<div className="text-center">
				{isPositive ? (
					<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
				) : (
					<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
				)}
				<div
					className={`text-2xl font-bold mb-4 ${isPositive ? "text-green-600" : "text-red-600"}`}
				>
					{choice.points > 0 ? `+${choice.points}` : choice.points} Points
				</div>
				<p className="text-lg text-slate-700 mb-6">{choice.feedback}</p>
				<div className="bg-blue-50 p-4 rounded-lg">
					<HelpCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
					<p className="text-blue-800 font-medium">
						{socialScenario.followUpQuestion}
					</p>
				</div>
			</div>
		);
	};

	const resultAnalyzer = (
		finalScore: number,
		allChoices: Array<{
			scenario: GenericScenario<SocialChoice>;
			choice: SocialChoice;
			scoreChange: number;
		}>,
	): GameResults<SocialChoice> => {
		const poorChoices = allChoices.filter((c) => c.choice.points < 0);
		const goodChoices = allChoices.filter((c) => c.choice.points > 0);

		return {
			finalScore,
			allChoices,
			summary: {
				totalQuestions: allChoices.length,
				poorChoicesCount: poorChoices.length,
				goodChoicesCount: goodChoices.length,
				averagePoints:
					allChoices.reduce((sum, c) => sum + c.choice.points, 0) /
					allChoices.length,
			},
		};
	};

	const resultsRenderer = (results: GameResults<SocialChoice>) => {
		const { finalScore, summary } = results;
		const poorChoices = results.allChoices.filter((c) => c.choice.points < 0);

		const getScoreMessage = () => {
			if (finalScore >= 600) return "Excellent Digital Citizen! 🌟";
			if (finalScore >= 400) return "Good Digital Citizen! 👍";
			if (finalScore >= 200) return "Developing Digital Awareness 📚";
			return "Needs Improvement in Digital Citizenship 📖";
		};

		const getScoreAdvice = () => {
			if (finalScore >= 600)
				return "You consistently make thoughtful, ethical choices online. Keep being a positive digital role model!";
			if (finalScore >= 400)
				return "You generally make good choices online. Focus on being more proactive in helping others.";
			if (finalScore >= 200)
				return "You're learning! Try to think more about how your online actions affect others.";
			return "Consider how your digital choices impact others. Seek guidance from trusted adults about online behavior.";
		};

		return (
			<div className="text-center space-y-6">
				<div className="text-6xl font-bold text-slate-700 mb-2">
					{finalScore}
				</div>
				<div className="text-2xl font-semibold text-slate-600 mb-4">
					{getScoreMessage()}
				</div>
				<div className="bg-blue-50 p-6 rounded-lg mb-6">
					<p className="text-blue-800 text-lg">{getScoreAdvice()}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
					<div className="bg-green-50 p-4 rounded-lg">
						<div className="text-2xl font-bold text-green-600">
							{summary.goodChoicesCount}
						</div>
						<div className="text-green-800">Good Choices</div>
					</div>
					<div className="bg-red-50 p-4 rounded-lg">
						<div className="text-2xl font-bold text-red-600">
							{summary.poorChoicesCount}
						</div>
						<div className="text-red-800">Poor Choices</div>
					</div>
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="text-2xl font-bold text-blue-600">
							{summary.totalQuestions}
						</div>
						<div className="text-blue-800">Total Questions</div>
					</div>
				</div>

				{poorChoices.length > 0 && (
					<div className="bg-yellow-50 p-6 rounded-lg mt-6">
						<h3 className="text-lg font-semibold text-yellow-800 mb-4">
							Areas for Improvement:
						</h3>
						<div className="space-y-2">
							{poorChoices.slice(0, 3).map((choice) => (
								<p key={choice.scenario.id} className="text-yellow-700 text-sm">
									• {(choice.scenario as SocialScenario).followUpQuestion}
								</p>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<ScenarioBasedGame
			title="Social Credit Game"
			description={
				<>
					<p className="mb-4">
						Make choices about online scenarios and see how they affect your
						social credit score.
					</p>
					<p className="text-base">
						Your choices have consequences. Think carefully about how your
						digital actions impact others and yourself.
					</p>
				</>
			}
			scenarios={scenarios}
			initialScore={500}
			questionsToAsk={QUESTIONS_TO_ASK}
			choiceRenderer={choiceRenderer}
			scoreCalculator={scoreCalculator}
			resultAnalyzer={resultAnalyzer}
			scoreRenderer={scoreRenderer}
			feedbackRenderer={feedbackRenderer}
			resultsRenderer={resultsRenderer}
			onNavigateHome={() => navigate({ to: "/online-safety" })}
		/>
	);
};

export default SocialCreditGame;
