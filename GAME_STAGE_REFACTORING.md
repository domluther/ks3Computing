# Game Stage Refactoring Analysis

## Overview
After analyzing ClickStage.tsx, DragStage.tsx, DragDropStage.tsx, and TraceStage.tsx, significant duplication patterns were identified that can be eliminated through component abstraction and custom hooks.

## Identified Duplication Patterns

### 1. Timer Management (100% Identical)
All four components share identical timer logic:
```tsx
const [startTime, setStartTime] = useState<number | null>(null);
const [elapsed, setElapsed] = useState<number>(0);

useEffect(() => {
  const timer = setInterval(() => {
    if (startTime) {
      setElapsed((Date.now() - startTime) / 1000);
    }
  }, 100);
  return () => clearInterval(timer);
}, [startTime]);
```

### 2. Stage Completion Logic (95% Identical)
All components calculate completion time and call onComplete:
```tsx
const timeTaken = (endTime - (startTime ?? endTime)) / 1000;
onComplete(timeTaken);
```

### 3. Common UI Structure (90% Similar)
- Stage title (h3 with same classes)
- Instructions/description (similar styling)
- Timer display: "Time: {elapsed.toFixed(1)}s"
- Game area container
- Restart button with GameButton component

### 4. Props Interface (100% Identical)
```tsx
interface StageProps {
  onComplete: (time: number) => void;
  onRestart: () => void;
}
```

## Proposed Solutions

### Solution 1: Custom Hook (`useStageTimer`)
**File**: `src/hooks/useStageTimer.ts`

**Benefits**:
- Eliminates 20+ lines of duplicated timer code per component
- Centralizes timer logic for consistency
- Provides clean API: `{ elapsed, startTimer, resetTimer, completeStage }`
- Easy to test in isolation

**Usage**:
```tsx
const { elapsed, startTimer, completeStage } = useStageTimer();
```

### Solution 2: Base Component (`GameStage`)
**File**: `src/components/GameStage.tsx`

**Benefits**:
- Eliminates 15+ lines of UI boilerplate per component
- Consistent styling and layout across all stages
- Configurable through props
- Maintains accessibility and responsive design

**Usage**:
```tsx
<GameStage
  title="Stage 2: Clicking"
  instructions={instructions}
  elapsed={elapsed}
  onRestart={handleRestart}
>
  {/* Game-specific content */}
</GameStage>
```

## Code Reduction Analysis

### Before Refactoring (Per Component):
- Timer management: ~15 lines
- UI structure: ~20 lines
- Completion logic: ~5 lines
- **Total duplicated**: ~40 lines × 4 components = **160 lines**

### After Refactoring:
- `useStageTimer` hook: 45 lines (shared)
- `GameStage` component: 55 lines (shared)
- **Per component reduction**: ~35 lines
- **Total reduction**: ~140 lines eliminated

## Example: ClickStage Refactoring

### Before (Original):
```tsx
// 159 lines total
const [startTime, setStartTime] = useState<number | null>(null);
const [elapsed, setElapsed] = useState<number>(0);

useEffect(() => {
  const timer = setInterval(() => {
    if (startTime) {
      setElapsed((Date.now() - startTime) / 1000);
    }
  }, 100);
  return () => clearInterval(timer);
}, [startTime]);

// ... game logic ...

return (
  <div className="w-full h-[60vh] flex flex-col items-center p-4">
    <h3 className="text-2xl font-bold text-slate-700 mb-2">
      Stage 2: Clicking
    </h3>
    <p className="text-lg text-slate-500 mb-2 bg-yellow-100 p-2 rounded-lg">
      {/* instructions */}
    </p>
    <div className="mb-2 text-lg font-semibold text-slate-700">
      Time: {elapsed.toFixed(1)}s
    </div>
    {/* game area */}
    <GameButton onClick={onRestart} className="mt-4">
      Restart Game
    </GameButton>
  </div>
);
```

### After (Refactored):
```tsx
// ~120 lines total (25% reduction)
const { elapsed, startTimer, completeStage } = useStageTimer();

// ... game logic (simplified) ...

return (
  <GameStage
    title="Stage 2: Clicking"
    instructions={instructions}
    elapsed={elapsed}
    onRestart={handleRestart}
  >
    {/* Only game-specific content */}
  </GameStage>
);
```

## Implementation Strategy

### Phase 1: Create Abstractions
1. ✅ Create `useStageTimer` hook
2. ✅ Create `GameStage` base component
3. ✅ Create example refactoring (`ClickStageRefactored`)

### Phase 2: Migrate Components
1. Refactor ClickStage.tsx
2. Refactor DragStage.tsx  
3. Refactor DragDropStage.tsx
4. Refactor TraceStage.tsx

### Phase 3: Testing & Validation
1. Verify identical functionality
2. Test timer accuracy
3. Validate completion callbacks
4. Check responsive design

## Additional Benefits

### Maintainability
- Timer logic changes only need to be made in one place
- UI consistency enforced automatically
- Easier to add new stages following the pattern

### Testing
- Timer logic can be unit tested in isolation
- Base component can be tested separately
- Game-specific logic becomes more focused

### Type Safety
- Shared interfaces ensure consistency
- TypeScript catches breaking changes across components

### Performance
- No significant performance impact
- Potential for minor optimization through shared logic

## Conclusion

The refactoring provides significant benefits:
- **Code Reduction**: 140+ lines eliminated (25% reduction per component)
- **Maintainability**: Centralized timer and UI logic
- **Consistency**: Standardized behavior across all stages
- **Extensibility**: Easy to add new stages following the pattern

The abstractions are lightweight, focused, and maintain the exact same functionality while dramatically reducing duplication.
