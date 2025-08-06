# Tanstack Router Setup

This document explains how routing is set up in the KS3 Computing application using Tanstack Router.

## Overview

The application has been migrated from state-based routing to proper URL-based routing using [Tanstack Router](https://tanstack.com/router/latest). This provides several benefits:

- **URL-based navigation**: Each page has its own URL
- **Browser history support**: Back/forward buttons work correctly
- **Bookmarkable pages**: Users can bookmark specific pages
- **Better UX**: Direct links to specific sections
- **Type safety**: All routes are type-checked

## File Structure

```
src/
├── router.tsx           # Main router configuration
├── routeConfig.ts       # Centralized route definitions
├── hooks/
│   └── useAppNavigation.ts  # Navigation hook
├── main.tsx            # App entry point with RouterProvider
├── components/
│   ├── ITSkillsLayout.tsx       # IT Skills hub layout with nested routing
│   ├── OnlineSafetyLayout.tsx   # Online Safety hub layout with nested routing
│   ├── MouseSkillsChallenge.tsx # Works directly with router
│   ├── FileSimulation.tsx       # Uses router hook for navigation
│   ├── PhishingGame.tsx         # Uses router hook for navigation
│   └── SocialCreditGame.tsx     # Uses router hook for navigation
└── pages/
    ├── ITSkillsGame.old.tsx     # Original component (preserved for reference)
    └── OnlineSafetyPage.old.tsx # Original component (preserved for reference)
```

## Clean Architecture Principles

The router setup follows clean architecture principles:

- **Router (`router.tsx`)**: Pure route definitions, no layout logic
- **Layout Components**: Handle UI and user interactions
- **Self-contained Components**: Use router hooks directly when needed
- **No Unnecessary Wrappers**: Components handle their own navigation needs

## Route Configuration

### Available Routes

| Page | URL | Component | Notes |
|------|-----|-----------|-------|
| Home | `/` | HomePage | |
| Input/Output | `/input-output` | InputOutputTool | |
| Online Safety Hub | `/online-safety` | OnlineSafetyLayout | Landing page with game selection |
| Phishing Game | `/online-safety/phishing` | PhishingGame | Nested route under Online Safety |
| Social Credit Game | `/online-safety/social-credit` | SocialCreditGame | Nested route under Online Safety |
| Algorithms | `/algorithms` | PlaceholderPage | |
| IT Skills Hub | `/it-skills` | ITSkillsLayout | Landing page with activity selection |
| Mouse Skills | `/it-skills/mouse-skills` | MouseSkillsChallenge | Nested route under IT Skills |
| File Simulation | `/it-skills/file-simulation` | FileSimulation | Nested route under IT Skills |

### Route Definitions

Routes are centrally defined in `routeConfig.ts`:

```typescript
export const routeConfigs: RouteConfig[] = [
  { page: 'home', path: '/' },
  { page: 'input-output', path: '/input-output' },
  { page: 'online-safety', path: '/online-safety' },
  { page: 'algorithms', path: '/algorithms' },
  { page: 'it-skills', path: '/it-skills' },
];
```

## Nested Routes

The application demonstrates nested routing patterns in two sections:

### Online Safety Route Structure
```
/online-safety                     # Landing page with game selection
├── /online-safety/phishing        # Spot the Phish! game
└── /online-safety/social-credit   # The Social Credit Game
```

### IT Skills Route Structure
```
/it-skills                    # Landing page with activity selection
├── /it-skills/mouse-skills   # Mouse Skills Challenge
└── /it-skills/file-simulation # File & Folder Simulation
```

### Implementation Details

**Parent Route** (`/it-skills`):
- Uses `ITSkillsLayout` component
- Shows intro page when at base route
- Renders child routes using `<Outlet />` for nested paths

**Child Routes**:
- `/mouse-skills` - Renders `MouseSkillsChallenge` component
- `/file-simulation` - Renders `FileSimulation` with navigation back to parent

**Navigation**:
- From IT Skills hub: Click buttons to navigate to child routes
- From child routes: Use "Exit" or back functionality to return to hub
- From navbar: Always goes to the IT Skills hub (`/it-skills`)

### Adding More Nested Routes

To add additional activities under IT Skills:

1. **Create the child route**:
   ```typescript
   const newActivityRoute = createRoute({
     getParentRoute: () => itSkillsRoute,
     path: '/new-activity',
     component: NewActivityComponent,
   });
   ```

2. **Add to route tree**:
   ```typescript
   itSkillsRoute.addChildren([
     itSkillsIndexRoute,
     mouseSkillsRoute,
     fileSimulationRoute,
     newActivityRoute, // Add here
   ])
   ```

3. **Update the ITSkillsLayout** to include navigation button:
   ```tsx
   <GameButton onClick={() => navigate({ to: '/it-skills/new-activity' as any })}>
     New Activity
   </GameButton>
   ```

### Main Router (`router.tsx`)

The router is configured with:

1. **Root Route**: Provides the main layout (Header, Navbar, content area)
2. **Child Routes**: Each page is a child route that renders in the content area
3. **Navigation Wrapper**: Handles the integration between the existing Navbar component and the router

### Key Components

- `RootLayout`: The main layout component that wraps all pages
- `HomePageWrapper`: Wrapper for the HomePage that provides router-aware navigation
- Route definitions for each page

## Navigation

### Using the Navigation Hook

Components can use the `useAppNavigation` hook for type-safe navigation:

```typescript
import { useAppNavigation } from '../hooks/useAppNavigation';

function MyComponent() {
  const { navigateToPage } = useAppNavigation();
  
  const handleClick = () => {
    navigateToPage('input-output');
  };
  
  // ...
}
```

### Existing Component Integration

The existing `Navbar` and `HomePage` components continue to work unchanged because:

1. The router provides navigation functions that match their expected interface
2. Wrapper components handle the integration between router hooks and component props

## Development Tools

The router includes Tanstack Router DevTools in development mode, which provides:

- Route visualization
- Navigation history
- Performance metrics
- Debugging information

## Type Safety

The router setup includes full TypeScript support:

```typescript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

This ensures that:
- All routes are type-checked
- Navigation is type-safe
- IDE provides autocompletion for routes

## Migration Notes

### What Changed

1. **Entry Point**: `main.tsx` now uses `RouterProvider` instead of the `App` component
2. **Navigation**: URL-based instead of state-based
3. **Layout**: Moved from `App.tsx` to `RootLayout` in `router.tsx`

### What Stayed the Same

1. **Component Interface**: All existing page components work unchanged
2. **Styling**: All Tailwind classes and layout remain identical
3. **Functionality**: All interactive features continue to work

### What Was Replaced

The following components have been replaced with router-aware layout components:

- **`ITSkillsGame.tsx`** → **`ITSkillsLayout.tsx`** (with nested routing)
- **`OnlineSafetyPage.tsx`** → **`OnlineSafetyLayout.tsx`** (with nested routing)

The original files have been renamed to `.old.tsx` for reference but are no longer used by the application.

### Backward Compatibility

The old `App.tsx` has been preserved as `App.old.tsx` for reference. To revert to state-based routing:

1. Restore `App.old.tsx` to `App.tsx`
2. Update `main.tsx` to use the `App` component
3. Remove router-related packages if desired

## Adding New Routes

To add a new route:

1. **Add to route config** (`routeConfig.ts`):
   ```typescript
   { page: 'new-page', path: '/new-page' }
   ```

2. **Update the Page type** (`types/types.ts`):
   ```typescript
   export type Page = 'home' | 'input-output' | 'online-safety' | 'algorithms' | 'it-skills' | 'new-page';
   ```

3. **Add route definition** (`router.tsx`):
   ```typescript
   const newPageRoute = createRoute({
     getParentRoute: () => rootRoute,
     path: '/new-page',
     component: NewPageComponent,
   });
   ```

4. **Add to route tree**:
   ```typescript
   const routeTree = rootRoute.addChildren([
     // ... existing routes
     newPageRoute,
   ]);
   ```

## Performance

The router setup is optimized for:

- **Code splitting**: Each route can be lazy-loaded if needed
- **Type safety**: Compile-time route checking
- **Bundle size**: Only includes necessary router code
- **Runtime performance**: Efficient route matching and navigation

## Testing

To test the router setup:

1. **Development**: Run `npm run dev` and navigate between pages
2. **Type checking**: Run `npm run type-check`
3. **Browser testing**: Test back/forward buttons, direct URL access, and bookmarking
4. **DevTools**: Use the Tanstack Router DevTools panel for debugging
