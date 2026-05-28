---
applyTo: "src/routes/**,src/components/**"
description: "Best practices for creating new pages and game components in this KS3 Computing project. Apply when adding a new hub topic, sub-page, game, or interactive component."
---

# KS3 Computing — New Page & Game Best Practices

## Project Stack

- **React** + **TypeScript** with **Vite**
- **TanStack Router v1** (file-based routing — auto-generates `routeTree.gen.ts`)
- **Tailwind CSS v4** (auto-detects classes — no config needed)
- **Biome** for formatting (tabs, double quotes)
- **Vitest** + `@testing-library/react` for tests

---

## Creating a New Sub-Page in an Existing Hub

### 3 files needed:

**1. Route file** — `src/routes/[topic]/[page-name].tsx`

Keep route files minimal — logic belongs in the component:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import MyNewComponent from "../../components/MyNewComponent";

export const Route = createFileRoute("/topic/page-name")({
	component: MyNewComponent,
});
```

**2. Component file** — `src/components/MyNewComponent.tsx`

See sizing rules and component templates below.

**3. Register the button** in `src/routes/[topic].tsx` — add an entry to the `buttons` array:
```tsx
{ text: "My New Game", route: "/topic/page-name", color: "green" }
```
Available colours: `"blue" | "green" | "red" | "orange" | "purple" | "yellow" | "indigo"`

> **NEVER edit `src/routeTree.gen.ts`** — it is auto-generated on every dev start.

---

## Creating a New Hub Topic

**4 files/changes needed:**

1. `src/routes/[topic].tsx` — hub route using `HubLayout` (see template below)
2. `src/routes/[topic]/[page].tsx` — sub-page route files
3. `src/data/pages.ts` — add entry to `navItems` array
4. `src/types/types.ts` — add new id string to `PageDescription.id` union

---

## HubLayout Template

```tsx
import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function MyTopicLayout() {
	return (
		<HubLayout
			basePath="/my-topic"
			title="My Topic Hub"
			description="Short description of what this hub covers."
			buttons={[
				{ text: "Game One",  route: "/my-topic/game-one",  color: "green"  },
				{ text: "Game Two",  route: "/my-topic/game-two",  color: "purple" },
			]}
		/>
	);
}

export const Route = createFileRoute("/my-topic")({
	component: MyTopicLayout,
});
```

---

## Sizing Rules (CRITICAL)

`HubLayout` already provides the background, padding, min-height, and horizontal centering for all sub-pages. Components must work **within** this wrapper.

### DO NOT use on outer wrappers of hub sub-page components:
- ❌ `min-h-screen` — overflows the layout; HubLayout controls height via `min-h-[85vh]`
- ❌ `bg-slate-100` on the outer div — HubLayout already provides it
- ❌ Gradient backgrounds on the outer wrapper (e.g. `bg-linear-to-br from-blue-50 to-purple-50`) — redundant
- ❌ `justify-center` on the outer flex wrapper — HubLayout uses `justify-start` for sub-routes

### DO start components with:
```tsx
<div className="w-full ...">
```
Then apply internal layout, centering, and padding within cards/sections.

### Root layout context for reference:
```
<div class="min-h-screen bg-slate-50">         ← outer page
  <div class="bg-white rounded-b-lg shadow-2xl max-w-7xl">  ← content card
    <Header />
    <Navbar />
    <main>
      <Outlet />  ← HubLayout wrapper renders here (bg-slate-100, min-h-[85vh], p-4, justify-start)
        <Outlet />  ← your component renders here
    </main>
  </div>
</div>
```

---

## Scenario-Based Game Component

Use `ScenarioBasedGame` when the game follows: intro → question → feedback → results.

**Named export:**
```tsx
import { ScenarioBasedGame } from "./ScenarioBasedGame";
import type { GameResults, GenericChoice, GenericScenario } from "./ScenarioBasedGame";
```

**Minimal usage:**
```tsx
const MyGame = () => {
	const navigate = useNavigate();

	const scenarios: GenericScenario<MyChoice>[] = [ ... ];

	return (
		<ScenarioBasedGame<MyChoice, MySummary>
			title="My Game Title"
			hubLink="/my-topic"
			description="Instructions for the player."
			scenarios={scenarios}
			initialScore={0}
			questionsToAsk={10}
			choiceRenderer={(choice, onSelect) => (
				<button type="button" onClick={onSelect}>{choice.label}</button>
			)}
			scoreCalculator={(choice, currentScore) => choice.isCorrect ? currentScore + 1 : currentScore}
			resultAnalyzer={(finalScore, allChoices) => ({
				finalScore,
				allChoices,
				summary: { totalQuestions: allChoices.length },
			})}
			onNavigateHome={() => navigate({ to: "/" })}
		/>
	);
};
export default MyGame;
```

**Built-in behaviours (no extra code needed):**
- Shuffles scenarios and choices on each play
- Keyboard shortcuts: `1`–`4` select choices, `Enter` advances from feedback
- Score progress bar (blue→purple gradient)
- Back to Hub button on intro screen
- Play Again / Back to Home on results screen

**`scoreCalculator` returns the NEW score** (not a delta):
```tsx
scoreCalculator={(choice, currentScore) => choice.isCorrect ? currentScore + 1 : currentScore}
```

**The component handles the outer wrapper** — do not add your own `min-h-screen` wrapper around it.

---

## Timer-Based Game Component (`GameStage`)

Use `GameStage` when the game has timed stages with a fixed-height interactive area.

```tsx
import GameStage from "./GameStage";
import { useStageTimer } from "../hooks/useStageTimer";

const MyTimedGame = () => {
	const { elapsed, startTimer, resetTimer } = useStageTimer();

	return (
		<GameStage
			title="My Timed Stage"
			instructions="Instruction text shown in yellow box"
			elapsed={elapsed}
			onRestart={() => { resetTimer(); startTimer(); }}
		>
			{/* game content — rendered in the remaining h-[60vh] */}
		</GameStage>
	);
};
```

`GameStage` outer div is `w-full h-[60vh] flex flex-col items-center p-4`. Do not add height constraints to children that would conflict with this.

---

## Button Components

Both are named exports from `./Buttons`:

```tsx
import { BackToHub, GameButton } from "./Buttons";

// Primary action button (green gradient, pill shape)
<GameButton onClick={handleStart}>Start Game</GameButton>

// Override colour for secondary buttons
<GameButton onClick={handleRestart} className="bg-slate-500 hover:bg-slate-600">
	Play Again
</GameButton>

// Navigate back to the hub (text-only button)
<BackToHub location="/my-topic" />
```

`GameButton` always renders with `type="button"`.

---

## Tailwind Style Reference

### Text
| Role | Class |
|---|---|
| Page heading | `text-4xl font-bold text-slate-800` |
| Section heading | `text-3xl font-bold text-slate-700` |
| Component heading (GameStage) | `text-2xl font-bold text-slate-700` |
| Body | `text-lg text-slate-600` |
| Instructions / muted | `text-slate-500` |
| Success | `text-green-600` |
| Error | `text-red-600` |
| Code / variable names | `font-mono text-violet-300` (dark bg) or `font-mono text-violet-700` (light bg) |

### Cards
```
bg-white shadow-lg rounded-xl p-8          ← standard card
bg-white shadow-2xl rounded-2xl p-8        ← prominent / modal
bg-slate-50 rounded-lg p-6                 ← inner section within card
bg-yellow-100 rounded-lg p-2               ← instructions highlight (GameStage)
```

### Feedback states
```
bg-green-50 border border-green-400 rounded-lg     ← correct answer
bg-red-50   border border-red-400   rounded-lg     ← wrong answer
bg-amber-50 border border-amber-300 rounded-lg     ← hint / warning
```

### Layout
| Pattern | Classes |
|---|---|
| Centred content column | `flex flex-col items-center` |
| Horizontal button row | `flex justify-center gap-4` |
| Max content width | `w-full max-w-2xl` (intro), `max-w-3xl` (playing), `max-w-4xl` (results) |
| Grid for choices | `grid grid-cols-1 gap-4 md:grid-cols-2` |

### Icons
Use `lucide-react` (already installed):
```tsx
import { CheckCircle, XCircle, AlertTriangle, Code2, RotateCcw, Shield } from "lucide-react";

// Standard size in a card header
<CheckCircle className="w-8 h-8 text-green-600" />

// Large hero icon
<Code2 className="w-14 h-14 text-violet-600" />
```

---

## Component File Structure

```tsx
// 1. React (type import only if needed)
import type React from "react";
import { useState, useCallback, useEffect } from "react";

// 2. Third-party
import { CheckCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

// 3. Internal utils / data
import { shuffleArray } from "../utils/utils";

// 4. Internal components
import { BackToHub, GameButton } from "./Buttons";

// --- TYPES ---
interface MyGameProps { ... }

// --- GAME DATA ---
const scenarios = [ ... ];

// --- COMPONENT ---
const MyGame: React.FC = () => {
	// --- STATE ---
	// --- LOGIC ---
	// --- RENDER ---
	return ( ... );
};

export default MyGame;
```

**Formatting (Biome):** indent with **tabs**, use **double quotes**, organise imports automatically.

---

## Testing

Test file location: `src/test/components/MyComponent.test.tsx`

**Always mock the router** when the component uses `useNavigate` or `useLocation`:
```tsx
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => mockNavigate,
}));
```

**Standard tests for a game component:**
```tsx
describe("MyGame", () => {
	it("renders the intro title", () => {
		render(<MyGame />);
		expect(screen.getByText("My Game Title")).toBeInTheDocument();
	});

	it("shows a Start Game button", () => {
		render(<MyGame />);
		expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
	});

	it("navigates back to hub when Back to Hub is clicked", async () => {
		render(<MyGame />);
		await userEvent.click(screen.getByRole("button", { name: /back to hub/i }));
		expect(mockNavigate).toHaveBeenCalledWith({ to: "/my-topic" });
	});
});
```

---

## Checklist for a New Sub-Page

- [ ] Route file created at `src/routes/[topic]/[page].tsx` (minimal — just `createFileRoute` + import)
- [ ] Component file created at `src/components/MyComponent.tsx`
- [ ] Button registered in `src/routes/[topic].tsx`
- [ ] Outer component wrapper uses `w-full`, no `min-h-screen`, no outer background
- [ ] All `<button>` elements have `type="button"`
- [ ] `BackToHub location="/topic"` added on intro/results screen
- [ ] `useNavigate` mocked in tests
- [ ] Test file created at `src/test/components/MyComponent.test.tsx`
- [ ] If adding a new topic: `PageDescription.id` union updated in `src/types/types.ts`
- [ ] If adding a new topic: entry added to `navItems` in `src/data/pages.ts`
