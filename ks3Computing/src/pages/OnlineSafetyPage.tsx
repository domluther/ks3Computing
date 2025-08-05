import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Shield, Wifi, WifiOff, Lock, HelpCircle } from 'lucide-react';
import GameButton from '../components/GameButton';

// --- SOCIAL CREDIT GAME COMPONENT ---
// This is the new game component for the social credit score activity.

const SocialCreditGame = ({ onExit }: { onExit: () => void }) => {
    // --- TYPE DEFINITIONS ---
    type GameStage = 'intro' | 'playing' | 'feedback' | 'results';

    interface Scenario {
        id: number;
        text: string;
        choices: {
            text: string;
            points: number;
            feedback: string;
        }[];
        followUpQuestion: string;
        shuffledChoices?: { text: string; points: number; feedback: string }[];
    }

    // --- GAME DATA ---
    const scenarios: Scenario[] = [
        {
            id: 1,
            text: "You see a classmate's embarrassing photo posted in a group chat. What do you do?",
            choices: [
                { text: "Share it with another friend for a laugh.", points: -25, feedback: "Sharing embarrassing content is a form of cyberbullying and hurts others." },
                { text: "Privately message the person who posted it and ask them to delete it.", points: 15, feedback: "Good choice. Standing up for others, even in private, is a positive action." },
                { text: "Report the photo to the group admin or a trusted adult.", points: 20, feedback: "Excellent. Reporting harmful content is the most effective way to stop its spread." },
                { text: "Ignore it. It's not your problem.", points: -5, feedback: "Doing nothing allows negative behaviour to continue. It's always better to act." },
            ],
            followUpQuestion: "Explain why sharing an embarrassing photo of someone else, even as a joke, could be hurtful."
        },
        {
            id: 2,
            text: "A new app asks for permission to access your contacts, location, and photos. The app lets you add funny filters to pictures.",
            choices: [
                { text: "Accept all permissions without reading. You want the filters!", points: -20, feedback: "Always question why an app needs certain data. Giving away personal info can be risky." },
                { text: "Deny all permissions.", points: 5, feedback: "This is safe, but you might miss out on app features. There's a more balanced option." },
                { text: "Check the app's privacy policy and only grant permissions that seem necessary.", points: 25, feedback: "Perfect! Being an informed digital citizen means understanding what you're sharing." },
                { text: "Only allow the permissions while using the app.", points: 15, feedback: "A smart compromise — this limits access and improves privacy while using the app." },
            ],
            followUpQuestion: "Describe what could go wrong if you give an app permission to access your contacts, location, and photos."
        },
        {
            id: 3,
            text: "Someone you don't know follows you on social media and sends a message saying 'hey'.",
            choices: [
                { text: "Follow them back and start a conversation.", points: -25, feedback: "Interacting with strangers online can be dangerous. You don't know who they really are." },
                { text: "Check their profile for mutual friends before deciding.", points: 10, feedback: "A good first step, but profiles can be faked. It's still a risk." },
                { text: "Ignore the message and block the user.", points: 20, feedback: "This is the safest option. You are in control of who you interact with online." },
                { text: "Ask a parent or trusted adult what to do before responding.", points: 15, feedback: "Excellent. Seeking adult advice before acting is always a good step." },
            ],
            followUpQuestion: "Explain why it is risky to talk to strangers online, even if they seem friendly or have mutual friends."
        },
        {
            id: 4,
            text: "You're playing an online game and another player starts using abusive language towards your teammate.",
            choices: [
                { text: "Join in and insult them back.", points: -30, feedback: "Adding to the negativity makes the online space worse for everyone." },
                { text: "Use the game's 'report player' function.", points: 25, feedback: "The best action. Reporting helps keep the game fun and safe for all players." },
                { text: "Send your teammate a supportive message.", points: 15, feedback: "A kind gesture that can make a big difference to someone's experience." },
                { text: "Quit the game.", points: -5, feedback: "While this removes you from the situation, it doesn't help solve the problem." },
            ],
            followUpQuestion: "Explain why joining in with insults online makes the situation worse than just ignoring it."
        },
        {
            id: 5,
            text: "You get an email saying you've won a new phone. It asks you to click a link and enter your password to claim it.",
            choices: [
                { text: "Click the link and enter your details.", points: -30, feedback: "This is a classic phishing scam. Never enter personal details from suspicious links." },
                { text: "Delete the email and ignore it.", points: 15, feedback: "Good. Deleting it is a safe action." },
                { text: "Report the email as phishing or junk.", points: 25, feedback: "Excellent. Reporting helps email providers block these scams for everyone." },
                { text: "Forward it to a friend to see if they think it's real.", points: -10, feedback: "This could spread the scam to your friends. It's better not to share it." },
            ],
            followUpQuestion: "State three signs that an email or message might be a phishing scam."
        },
        {
            id: 6,
            text: "You're about to post a photo from a party. You look a bit silly in it, but it's funny.",
            choices: [
                { text: "Post it. It's just a laugh and part of my digital footprint.", points: -15, feedback: "This photo is now part of your digital footprint forever. Future schools or employers might see it." },
                { text: "Ask the friends in the photo if they're okay with you posting it.", points: 20, feedback: "Great idea. Always get consent before posting photos of others." },
                { text: "Post it but only to your 'close friends' list.", points: 5, feedback: "Better, but 'close friends' can still screenshot and share it. Think before you post." },
                { text: "Decide not to post it.", points: 10, feedback: "A safe choice. Not everything needs to be shared online." },
            ],
            followUpQuestion: "Define what 'digital footprint' means. Explain how a photo you post today could affect you in the future."
        },
        {
            id: 7,
            text: "You get a text from an unknown number: \"Hi mum, I've broken my phone. Can you send me £50 to get it fixed?\"",
            choices: [
                { text: "Send the money immediately. You have to help!", points: -30, feedback: "This is a common scam. Scammers pretend to be family members in trouble." },
                { text: "Text back asking \"who is this?\".", points: -5, feedback: "Replying confirms your number is active. They might target you with more scams." },
                { text: "Try to call your mum's original number to check if she's okay.", points: 25, feedback: "The best action. Always verify unusual requests through a different, trusted method." },
                { text: "Ignore and delete the message.", points: 15, feedback: "A good, safe option." },
            ],
            followUpQuestion: "Explain why you shouldn't reply to a scam text message, even to ask who it is."
        },
        {
            id: 8,
            text: "Your friend tells you a secret and makes you promise not to tell anyone. Later, your other friend asks you what's going on.",
            choices: [
                { text: "Tell them the secret. They're your best friend too.", points: -25, feedback: "Breaking someone's trust by sharing information without consent can damage a friendship." },
                { text: "Tell them you can't say because you promised.", points: 20, feedback: "Respecting people's privacy and consent is a key part of being a good friend." },
                { text: "Hint at the secret without giving all the details.", points: -10, feedback: "This is still a form of gossip and can lead to the secret getting out." },
                { text: "Change the subject or distract them without mentioning the secret.", points: 10, feedback: "A subtle way to protect your friend's privacy without creating tension." },
            ],
            followUpQuestion: "Define what 'consent' means in the context of sharing information online."
        },
        {
            id: 9,
            text: "In a YouTube comment section, you see someone making discriminatory racist comments about a creator.",
            choices: [
                { text: "Reply to the comment and argue with them.", points: -5, feedback: "Arguing with trolls often encourages them. It's better not to engage directly." },
                { text: "Report the comment for hate speech.", points: 25, feedback: "Perfect. Reporting is the most effective tool to get harmful content removed." },
                { text: "'Dislike' the comment.", points: 5, feedback: "A small action, but reporting is much more powerful." },
                { text: "Just scroll past it.", points: 0, feedback: "Ignoring it doesn't help, but at least you're not making it worse." },
            ],
            followUpQuestion: "Describe why it is more effective to report hateful comments than to argue with the person who posted them."
        },
        {
            id: 10,
            text: "You post a video of your new hobby, and a troll comments \"this is so boring, get a life\".",
            choices: [
                { text: "Post an angry reply defending your hobby.", points: -10, feedback: "This is what a troll wants! They feed on angry reactions." },
                { text: "Delete their comment and block the user.", points: 20, feedback: "A great way to manage your online space. You don't have to put up with negativity." },
                { text: "Reply with a joke.", points: 10, feedback: "Sometimes humour can disarm a troll, but blocking is often safer and easier." },
                { text: "Feel sad and delete your video.", points: -15, feedback: "Don't let one negative person stop you from enjoying your hobbies." },
            ],
            followUpQuestion: "State what a 'troll' is. Describe what the best way to deal with trolling comments is."
        },
        {
            id: 11,
            text: "A cool online quiz promises to tell you your 'spirit animal' if you enter your full name, date of birth, and primary school.",
            choices: [
                { text: "Enter all the details to get your result.", points: -25, feedback: "This is way too much personal information. It can be used for identity theft." },
                { text: "Make up fake details to do the quiz.", points: 15, feedback: "A clever way to protect your privacy while still having fun." },
                { text: "Close the page. It's not worth the risk.", points: 20, feedback: "A very sensible and safe decision." },
                { text: "Use your real name but a fake birthday and school.", points: -10, feedback: "Still risky. Your full name is a key piece of personal data." },
            ],
            followUpQuestion: "List three pieces of personal information you should never share online and explain why."
        },
        {
            id: 12,
            text: "You and your friends are hanging out in a town centre. You notice there are lots of CCTV cameras.",
            choices: [
                { text: "Do a silly dance in front of a camera.", points: 0, feedback: "Harmless fun, but it highlights that you are being recorded in public spaces." },
                { text: "Feel worried and want to go home.", points: -5, feedback: "It's okay to be aware of cameras, but they are also there for public safety." },
                { text: "Discuss with your friends why the cameras are there.", points: 15, feedback: "Good. Thinking critically about surveillance and its purpose (like safety) is a smart habit." },
                { text: "Look around to see if there are signs explaining who owns the cameras.", points: 15, feedback: "Good thinking. It's useful to know who is collecting data in public spaces." },
            ],
            followUpQuestion: "State two pros and cons of having CCTV cameras in public places."
        },
        {
            id: 13,
            text: "You're playing a game on your phone that's connected to your parents' account. A pop-up offers a special item for £9.99.",
            choices: [
                { text: "Buy it without asking. You can pay them back later.", points: -30, feedback: "Making purchases without permission is like stealing and can get you into serious trouble." },
                { text: "Ask your parents if you can buy it.", points: 25, feedback: "The only correct answer. Always get permission before spending money online." },
                { text: "Close the pop-up and keep playing without the item.", points: 15, feedback: "Good self-control! You don't need to spend money to have fun." },
            ],
            followUpQuestion: "Describe why it is important to always get permission before making any in-app purchases."
        },
        {
            id: 14,
            text: "You see a shocking headline on a news site you've never heard of: \"Scientists Prove Eating Chocolate Cures All Illness!\".",
            choices: [
                { text: "Share it on social media immediately. Everyone needs to know!", points: -20, feedback: "Spreading misinformation is easy. Always check the source before you share." },
                { text: "Check a trusted news source like the BBC to see if they are reporting it.", points: 25, feedback: "Excellent critical thinking. Verifying information with reliable sources is a vital skill." },
                { text: "Assume it's probably fake and just ignore it.", points: 10, feedback: "A good assumption, but actively verifying is even better." },
                { text: "Ask someone like a parent or teacher what they think before sharing.", points: 15, feedback: "Talking to a trusted adult can help you avoid spreading false information." },

            ],
            followUpQuestion: "Describe how you can check if a news story you see online is real or fake. Name a trusted news source."
        },
        {
            id: 15,
            text: "You're signing up for a new website. It asks for a password.",
            choices: [
                { text: "Use the same password you use for everything else.", points: -25, feedback: "If one account gets hacked, all your accounts are at risk. Use unique passwords." },
                { text: "Use your pet's name and your birthday, like \"Fluffy2012\".", points: -15, feedback: "This is easy for someone who knows you to guess." },
                { text: "Use three random words, like \"CorrectHorseBattery\".", points: 20, feedback: "A great method for creating strong, memorable passwords." },
                { text: "Use a password manager to generate a random password.", points: 25, feedback: "The gold standard for password security. Fantastic choice." },
            ],
            followUpQuestion: "Explain why using the same password for multiple websites is a bad idea. Describe how to create a strong password."
        },
        {
            id: 16,
            text: "You post a great photo on Instagram from your family holiday.",
            choices: [
                { text: "Tag the exact hotel you are staying at.", points: -20, feedback: "This tells everyone you're not at home, which could make your house a target for burglary." },
                { text: "Tag the general city you're in, like \"London\".", points: 5, feedback: "Better, but still gives away that you are away from home." },
                { text: "Post the photo, but don't add any location tag.", points: 15, feedback: "A safe option. You're sharing the memory without sharing your live location." },
                { text: "Wait until you get home to post your holiday photos.", points: 25, feedback: "The safest way to share holiday pictures. It protects your privacy and security." },
            ],
            followUpQuestion: "Explain how posting photos while you are on holiday could be a security risk."
        },
        {
            id: 17,
            text: "In a class WhatsApp group, a few people are making fun of someone's new haircut using unkind memes.",
            choices: [
                { text: "'Like' or react to the funny memes.", points: -25, feedback: "This makes you part of the cyberbullying problem. Your reaction encourages the bullies." },
                { text: "Leave the group.", points: -5, feedback: "This removes you from the situation but doesn't help the person being targeted." },
                { text: "Privately message the person being made fun of and ask if they are okay.", points: 20, feedback: "An incredibly kind and supportive action. It can make a huge difference." },
                { text: "Take a screenshot and show it to a teacher or your parents.", points: 25, feedback: "Excellent. Reporting the bullying to a trusted adult is the best way to make it stop." },
            ],
            followUpQuestion: "Describe two different positive actions you could take if you see cyberbullying happening in a group chat."
        },
        {
            id: 18,
            text: "You're installing a new game. A huge wall of text appears (the Terms & Conditions).",
            choices: [
                { text: "Scroll to the bottom and click 'Agree' without reading.", points: -10, feedback: "Very common, but you could be agreeing to anything, like letting them sell your personal information." },
                { text: "Ask a parent or older sibling to look at it with you.", points: 15, feedback: "A good idea to get help understanding what you're agreeing to." },
                { text: "Try to find a summary of the T&Cs online.", points: 20, feedback: "A great research skill. Some websites simplify these long documents." },
                { text: "Look for a 'key points' or 'TL;DR' section at the top.", points: 15, feedback: "Smart! Many apps now include summaries — they're easier to understand." },
            ],
            followUpQuestion: "State what kind of things might you be agreeing to if you don't read the Terms & Conditions."
        },
        {
            id: 19,
            text: "A friend tags you in a post where you are complaining about a teacher. This affects your digital footprint.",
            choices: [
                { text: "Laugh and share the post.", points: -20, feedback: "This is now part of your digital footprint. It looks disrespectful and could get you in trouble at school." },
                { text: "Untag yourself from the post.", points: 15, feedback: "Good. This removes the direct link to your profile." },
                { text: "Untag yourself and ask your friend to delete the post.", points: 25, feedback: "The best response. It manages your own reputation and shows respect for others." },
                { text: "Comment on the post saying it was just a joke.", points: -5, feedback: "Even if you say it's a joke, the post still reflects poorly on you and stays online." },
            ],
            followUpQuestion: "Explain how a negative post about a teacher could damage your digital footprint."
        },
        {
            id: 20,
            text: "You find a website that lets you upload a photo of a friend and put their face into a funny video clip.",
            choices: [
                { text: "Do it without asking them. It's just a joke.", points: -25, feedback: "This is creating a 'deepfake'. Doing this without consent is a serious breach of their privacy." },
                { text: "Ask your friend for permission before you do it.", points: 20, feedback: "Consent is key. If they say yes, it's just harmless fun." },
                { text: "Decide not to do it, as it feels a bit weird.", points: 10, feedback: "Trusting your instincts is important. If something feels wrong, it's often best to avoid it." },
                { text: "Use a celebrity photo instead of your friend's.", points: 5, feedback: "Better than using a friend without consent — but always consider ethical use and copyright." },
            ],
            followUpQuestion: "State what a deepfake is. Explain why creating one of a friend without their permission is a bad idea."
        }
    ];

    // --- STATE MANAGEMENT ---
    const [stage, setStage] = useState<GameStage>('intro');
    const [score, setScore] = useState(500);
    const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [lastChoice, setLastChoice] = useState<{ points: number; feedback: string } | null>(null);
    const [poorChoiceQuestions, setPoorChoiceQuestions] = useState<string[]>([]);
    const [discussionQuestions, setDiscussionQuestions] = useState<string[]>([]);


    // --- GAME LOGIC ---

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

    // Determine discussion questions when results stage is reached
    useEffect(() => {
        if (stage === 'results') {
            let questions: string[] = [];
            if (poorChoiceQuestions.length > 0) {
                // Shuffle poor choices and take the first two
                questions = [...poorChoiceQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
            } else {
                // Pick two random questions from all scenarios for perfect players
                questions = scenarios
                    .map(s => s.followUpQuestion)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 2);
            }
            setDiscussionQuestions(questions);
        }
    }, [stage, poorChoiceQuestions]);


    const handleChoice = (points: number, feedback: string) => {
        setScore(prev => Math.max(0, prev + points)); // Ensure score doesn't go below 0
        setLastChoice({ points, feedback });
        if (points < 0) {
            const currentQuestion = shuffledScenarios[currentScenarioIndex].followUpQuestion;
            // Avoid adding duplicate questions
            if (!poorChoiceQuestions.includes(currentQuestion)) {
                 setPoorChoiceQuestions(prev => [...prev, currentQuestion]);
            }
        }
        setStage('feedback');
    };

    const handleNext = () => {
        if (currentScenarioIndex < scenarios.length - 1) {
            setCurrentScenarioIndex(prev => prev + 1);
            setStage('playing');
        } else {
            setStage('results');
        }
        setLastChoice(null);
    };

    const startGame = () => {
        const shuffled = shuffleArray(scenarios).map((s) => ({
            ...s,
            shuffledChoices: shuffleArray(s.choices),
        }));

        setShuffledScenarios(shuffled);
        setScore(500);
        setCurrentScenarioIndex(0);
        setLastChoice(null);
        setPoorChoiceQuestions([]);
        setDiscussionQuestions([]);
        setStage('playing');
    }

    const resetGame = () => {
        setScore(500);
        setCurrentScenarioIndex(0);
        setLastChoice(null);
        setPoorChoiceQuestions([]);
        setDiscussionQuestions([]);
        setStage('intro');
    };

    // --- UI RENDERING ---
    const renderScoreBar = () => (
        <div className="w-full max-w-2xl bg-gray-200 rounded-full h-8 dark:bg-gray-700 my-4 shadow-inner">
            <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-8 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (score / 1000) * 100)}%` }} // Cap width at 100%
            ></div>
            <span className="relative bottom-8 text-center w-full block font-bold text-slate-800">{`Score: ${score}`}</span>
        </div>
    );

    const renderIntro = () => (
        <div className="text-center p-8 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">The Social Credit Game</h2>
            <p className="text-lg text-slate-600 mb-6">
                In some places, technology is used to track citizens' behaviour. This creates a 'social credit score' that can affect their lives.
            </p>
            <p className="text-lg text-slate-600 mb-8">
                In this game, you'll face 20 online situations. Your choices will change your social credit score. At the end, you'll get some questions to discuss. See how your digital citizenship skills measure up!
            </p>
            <div className="flex justify-center gap-4">
                 <GameButton onClick={startGame}>Start Game</GameButton>
                 <button onClick={onExit} className="text-slate-600 hover:text-slate-800 font-semibold py-3 px-6">Back to Hub</button>
            </div>
        </div>
    );

    const renderPlaying = () => {
        if (shuffledScenarios.length === 0) return null;
        const scenario = shuffledScenarios[currentScenarioIndex];
        // console.log('Current Scenario:', scenario);
        console.log('All Scenarios:', shuffledScenarios);
        console.log(currentScenarioIndex, 'of', shuffledScenarios.length);
        const choices = scenario.shuffledChoices ?? scenario.choices;

        return (
            <div className="w-full max-w-3xl p-8">
                {renderScoreBar()}
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <p className="text-gray-500 font-medium mb-4">Question {currentScenarioIndex + 1} of {scenarios.length}</p>
                    <p className="text-2xl font-semibold text-slate-700 mb-8">{scenario.text}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {choices.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => handleChoice(choice.points, choice.feedback)}
                                className="bg-slate-100 text-slate-800 font-semibold p-4 rounded-lg shadow-sm hover:bg-slate-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-left"
                            >
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderFeedback = () => {
        if (!lastChoice) return null;
        const isPositive = lastChoice.points > 0;
        return (
            <div className="w-full max-w-3xl p-8 text-center flex flex-col items-center">
                 {renderScoreBar()}
                 <div className="bg-white p-8 rounded-xl shadow-lg w-full">
                    {isPositive ? (
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    ) : (
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    )}
                    <h3 className={`text-3xl font-bold mb-4 ${isPositive ? 'text-green-600' : lastChoice.points === 0 ? 'text-slate-600' : 'text-red-600'}`}>
                        {lastChoice.points > 0 ? `+${lastChoice.points}`: lastChoice.points} Points
                    </h3>
                    <p className="text-xl text-slate-600 mb-8">{lastChoice.feedback}</p>
                    <GameButton onClick={handleNext}>
                        {currentScenarioIndex < scenarios.length - 1 ? 'Next Question' : 'See Results'}
                    </GameButton>
                 </div>
            </div>
        );
    };

    const renderResults = () => {
        let resultData;
        // New score boundaries for 20 questions
        if (score >= 800) {
            resultData = {
                title: "Excellent Digital Citizen!",
                color: "text-green-600",
                icon: <CheckCircle className="w-20 h-20 mx-auto" />,
                perks: [
                    { text: "High-speed internet access", icon: <Wifi className="w-6 h-6 text-green-500" /> },
                    { text: "Access to exclusive online communities", icon: <Lock className="w-6 h-6 text-green-500" /> },
                    { text: "Verified 'Trusted User' status", icon: <Shield className="w-6 h-6 text-green-500" /> }
                ],
                message: "Your positive and responsible online actions have earned you a high social credit score. You've helped make the internet a better place!"
            };
        } else if (score < 300) {
            resultData = {
                title: "Low Social Score Warning",
                color: "text-red-600",
                icon: <XCircle className="w-20 h-20 mx-auto" />,
                perks: [
                    { text: "Restricted internet speeds", icon: <WifiOff className="w-6 h-6 text-red-500" /> },
                    { text: "Limited access to social apps", icon: <Lock className="w-6 h-6 text-red-500" /> },
                    { text: "Online posts require review", icon: <Shield className="w-6 h-6 text-red-500" /> }
                ],
                message: "Your choices have resulted in a low social credit score. This could lead to online restrictions. Reflect on how to be a safer and more respectful digital citizen."
            };
        } else {
            resultData = {
                title: "Average Digital Citizen",
                color: "text-slate-800",
                icon: <Shield className="w-20 h-20 mx-auto text-yellow-500" />,
                perks: [
                    { text: "Standard internet access", icon: <Wifi className="w-6 h-6 text-slate-500" /> },
                    { text: "Normal access to online services", icon: <Lock className="w-6 h-6 text-slate-500" /> }
                ],
                message: "Your social credit score is average. You've made some good choices, but there's room for improvement. Keep thinking about the impact of your actions online."
            };
        }

        return (
            <div className="text-center p-8 max-w-3xl mx-auto">
                <div className={`bg-white p-8 rounded-xl shadow-2xl border-t-8 ${score >= 800 ? 'border-green-500' : score < 300 ? 'border-red-500' : 'border-yellow-500'}`}>
                    <div className={resultData.color}>{resultData.icon}</div>
                    <h2 className={`text-4xl font-bold mt-4 mb-2 ${resultData.color}`}>{resultData.title}</h2>
                    <p className="text-2xl font-bold text-slate-800 mb-6">Final Score: {score}</p>
                    <p className="text-lg text-slate-600 mb-8">{resultData.message}</p>
                    
                    <div className="text-left bg-slate-50 p-6 rounded-lg max-w-md mx-auto">
                        <h4 className="font-bold text-xl mb-4 text-slate-700">Your Status Unlocks:</h4>
                        <ul className="space-y-3">
                            {resultData.perks.map((perk, i) => (
                                <li key={i} className="flex items-center text-lg text-slate-600">
                                    {perk.icon}
                                    <span className="ml-3">{perk.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {discussionQuestions.length > 0 && (
                        <div className="text-left bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg max-w-2xl mx-auto mt-8">
                            <h4 className="font-bold text-xl mb-4 text-amber-800 flex items-center">
                                <HelpCircle className="w-6 h-6 mr-2" />
                                Points to Consider
                            </h4>
                            <ul className="space-y-4 list-disc list-inside text-slate-700">
                                {discussionQuestions.map((q, i) => (
                                    <li key={i} className="text-lg">{q}</li>
                                ))}
                            </ul>
                        </div>
                    )}


                    <div className="flex justify-center gap-4 mt-8">
                        <GameButton onClick={resetGame}>Play Again</GameButton>
                        <button onClick={onExit} className="text-slate-600 hover:text-slate-800 font-semibold py-3 px-6">Back to Hub</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderStage = () => {
        switch (stage) {
            case 'intro': return renderIntro();
            case 'playing': return renderPlaying();
            case 'feedback': return renderFeedback();
            case 'results': return renderResults();
            default: return renderIntro();
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            {renderStage()}
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
// This is the new landing page for the Online Safety section.

const OnlineSafetyPage = () => {
    // --- TYPE DEFINITIONS ---
    type GameSelection = 'intro' | 'socialCredit';

    // --- STATE MANAGEMENT ---
    const [game, setGame] = useState<GameSelection>('intro');

    const renderContent = () => {
        switch (game) {
            case 'intro':
                return (
                    <div className="text-center p-8">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">Online Safety Hub</h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                           Staying safe online is a vital skill. These activities will help you think critically about your digital footprint and online interactions.
                        </p>
                        <div className="flex justify-center gap-8">
                            <GameButton onClick={() => setGame('socialCredit')}>The Social Credit Game</GameButton>
                            {/* You can add more buttons for future games here */}
                        </div>
                    </div>
                );
            case 'socialCredit':
                return <SocialCreditGame onExit={() => setGame('intro')} />;
        }
    };

    return (
        <div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
            {renderContent()}
        </div>
    );
};

export default OnlineSafetyPage;
