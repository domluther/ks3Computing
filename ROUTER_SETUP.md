# TanStack Router Setup

This document explains how routing is set up in the KS3 Computing application using TanStack Router's **file-based routing**.

## Overview

The application uses [TanStack Router](https://tanstack.com/router/latest) with **file-based routing** for a modern, type-safe routing experience. This provides several benefits:

- **URL-based navigation**: Each page has its own URL
- **Browser history support**: Back/forward buttons work correctly
- **Bookmarkable pages**: Users can bookmark specific pages
- **Better UX**: Direct links to specific sections
- **Type safety**: All routes are automatically type-checked
- **File-based routing**: Routes are automatically generated from file structure
- **Code splitting**: Automatic route-based bundle splitting

## File Structure

```
src/
├── routes/                  # File-based routing (auto-generated)
│   ├── __root.tsx          # Root layout component
│   ├── index.tsx           # Home route (/)
│   ├── hardware-software.tsx    # Hardware & Software tool
│   ├── algorithms.tsx      # Algorithms (placeholder)
│   ├── maths.tsx          # Maths section
│   ├── it-skills.tsx      # IT Skills hub with nested routing
│   ├── online-safety.tsx  # Online Safety hub with nested routing
│   ├── hardware-software/
│   │   ├── ascii-binary.tsx     # ASCII/Binary converter
│   │   └── name-hardware.tsx    # Hardware naming activity
│   ├── it-skills/
│   │   ├── mouse-skills.tsx     # Mouse Skills Challenge
│   │   └── file-simulation.tsx  # File & Folder Simulation
│   ├── online-safety/
│   │   ├── phishing.tsx         # Spot the Phish! game
│   │   └── social-credit.tsx    # Social Credit Game
│   └── maths/
│       └── [...routes]          # Math activities
├── components/             # All UI components (self-contained)
│   ├── PhishingGame.tsx    # Phishing detection game
│   ├── SocialCreditGame.tsx # Social credit scenarios
│   ├── MouseSkillsChallenge.tsx # Mouse skills activities
│   ├── FileSimulation.tsx  # File system simulation
│   ├── InputOutputTool.tsx # Hardware categorization
│   ├── ASCIIBinaryTool.tsx # ASCII/Binary conversion
│   ├── NameHardware.tsx    # Hardware identification
│   └── [other components]
├── main.tsx               # App entry point with auto-generated router
└── routeTree.gen.ts       # Auto-generated route tree (DO NOT EDIT)
```

## Clean Architecture Principles

The current routing setup follows modern best practices:

- **File-based routing**: Routes automatically generated from folder structure
- **Self-contained components**: Each component handles its own navigation
- **Type safety**: Auto-generated types for all routes
- **Direct navigation**: Components use `useNavigate()` directly
- **Layout components**: Embedded in route files for nested routing
- **No prop drilling**: Navigation functions aren't passed through props

## Route Configuration

### Available Routes

| Page | URL | Component | Notes |
|------|-----|-----------|-------|
| Home | `/` | HomePage | Welcome page with navigation to all sections |
| Hardware & Software Hub | `/hardware-software` | Hardware/Software Layout | Tools for learning about computer hardware |
| ├─ Input/Output Tool | `/hardware-software` | InputOutputTool | Drag-and-drop Venn diagram activity |
| ├─ ASCII/Binary Tool | `/hardware-software/ascii-binary` | ASCIIBinaryTool | Convert between text and binary |
| ├─ Name Hardware | `/hardware-software/name-hardware` | NameHardware | Hardware identification activity |
| Online Safety Hub | `/online-safety` | OnlineSafety Layout | Landing page with safety game selection |
| ├─ Phishing Game | `/online-safety/phishing` | PhishingGame | "Spot the Phish!" email detection game |
| ├─ Social Credit Game | `/online-safety/social-credit` | SocialCreditGame | Digital citizenship scenarios |
| IT Skills Hub | `/it-skills` | ITSkills Layout | Landing page with computer skills activities |
| ├─ Mouse Skills | `/it-skills/mouse-skills` | MouseSkillsChallenge | Mouse control practice activities |
| ├─ File Simulation | `/it-skills/file-simulation` | FileSimulation | Windows file system simulation |
| Mathematics Hub | `/maths` | Maths Layout | Mathematical computing concepts |
| Algorithms | `/algorithms` | PlaceholderPage | Future algorithms section |

### File-Based Routing

Routes are automatically generated from the file structure in `src/routes/`. The router plugin scans this directory and creates a route tree with full TypeScript support.

**Example Route Creation:**
```
src/routes/online-safety/phishing.tsx
└─ Creates route: /online-safety/phishing
```

**Route File Structure:**
```tsx
import { createFileRoute } from '@tanstack/react-router'
import ComponentName from '../../components/ComponentName'

export const Route = createFileRoute('/route-path')({
  component: ComponentName,
})
```

## Nested Routes

The application demonstrates nested routing patterns in multiple sections:

### Online Safety Route Structure
```
/online-safety                     # Hub with game selection
├── /online-safety/phishing        # "Spot the Phish!" email game
└── /online-safety/social-credit   # Digital citizenship scenarios
```

### IT Skills Route Structure
```
/it-skills                    # Hub with activity selection
├── /it-skills/mouse-skills   # Mouse control practice
└── /it-skills/file-simulation # File & folder management
```

### Hardware & Software Route Structure
```
/hardware-software                      # Input/Output tool (main activity)
├── /hardware-software/ascii-binary    # ASCII to binary converter
└── /hardware-software/name-hardware   # Hardware identification quiz
```

### Implementation Details

**Parent Routes** (e.g., `/it-skills.tsx`):
- Contain layout logic for the hub page
- Show intro/navigation when at base route
- Use `<Outlet />` to render child routes for nested paths
- Handle navigation between child activities

**Child Routes** (e.g., `/it-skills/mouse-skills.tsx`):
- Import and render the specific component
- Self-contained with direct navigation back to parent
- Use `useNavigate()` hook for routing

**Navigation Example:**
```tsx
// In a component
import { useNavigate } from '@tanstack/react-router'

function GameComponent() {
  const navigate = useNavigate()
  
  const exitGame = () => {
    navigate({ to: '/it-skills' }) // Direct, type-safe navigation
  }
  
  return <button onClick={exitGame}>Back to Hub</button>
}
```

## Navigation

### Modern Navigation Pattern

Components use TanStack Router hooks directly for type-safe navigation:

```tsx
import { useNavigate, useLocation } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleNavigation = () => {
    navigate({ to: '/online-safety/phishing' }) // Fully type-safe
  }
  
  const isActive = location.pathname === '/online-safety'
  
  return (
    <button onClick={handleNavigation}>
      Go to Phishing Game
    </button>
  )
}
```

### Component Integration

All components are self-contained and handle their own navigation:

- **Navbar**: Uses `useLocation()` for active state detection
- **Game Components**: Use `useNavigate()` for exit/back functionality  
- **HomePage**: Navigation buttons use direct route paths
- **Layout Components**: Handle hub-to-activity navigation

### Type Safety

The router automatically generates types from your route structure:

```tsx
// This is type-checked and autocompleted
navigate({ to: '/it-skills/mouse-skills' })

// TypeScript will error if route doesn't exist
navigate({ to: '/invalid-route' }) // ❌ Type error
```

## Development Tools

The router includes TanStack Router DevTools in development mode, which provides:

- Route visualization and debugging
- Navigation history tracking
- Performance metrics
- Real-time route tree inspection

## Adding New Routes

To add a new route using file-based routing:

### 1. Simple Route
Create a new file in `src/routes/`:
```tsx
// src/routes/new-page.tsx
import { createFileRoute } from '@tanstack/react-router'
import NewPageComponent from '../components/NewPageComponent'

export const Route = createFileRoute('/new-page')({
  component: NewPageComponent,
})
```

### 2. Nested Route
Create a new file in an existing directory:
```tsx
// src/routes/it-skills/new-activity.tsx
import { createFileRoute } from '@tanstack/react-router'
import NewActivityComponent from '../../components/NewActivityComponent'

export const Route = createFileRoute('/it-skills/new-activity')({
  component: NewActivityComponent,
})
```

### 3. Hub with Children
Create both the parent and child routes:
```tsx
// src/routes/new-section.tsx (Hub)
import { createFileRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'

function NewSectionLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/new-section') {
    return (
      <div>
        <h2>New Section Hub</h2>
        <button onClick={() => navigate({ to: '/new-section/activity1' })}>
          Activity 1
        </button>
      </div>
    )
  }

  return <Outlet />
}

export const Route = createFileRoute('/new-section')({
  component: NewSectionLayout,
})
```

### 4. Update Navigation
Add your new route to the navbar in `src/data/pages.ts`:
```tsx
export const navItems: PageDescription[] = [
  // ... existing items
  { 
    id: 'new-section', 
    emoji: '🆕', 
    title: 'New Section', 
    description: 'Description of new section',
    enabled: true 
  },
];
```

## Migration Summary

### What Changed from Old System

1. **❌ Removed Files:**
   - `routeConfig.ts` - Manual route mapping
   - `router.tsx` - Programmatic router setup
   - `useAppNavigation.ts` - Custom navigation hook
   - `src/pages/` directory - Separate pages folder
   - Layout components in `/components` (moved to route files)

2. **✅ New File-Based System:**
   - `src/routes/` - Auto-generated routing from file structure
   - `routeTree.gen.ts` - Auto-generated type definitions
   - Direct navigation with `useNavigate()`
   - Layout logic embedded in route files

### What Stayed the Same

1. **Component Interface**: All game/activity components work unchanged
2. **Styling**: All Tailwind classes and styling remain identical  
3. **Functionality**: All interactive features continue to work
4. **User Experience**: Navigation and URLs remain the same

## Performance Benefits

The file-based routing system provides:

- **Automatic code splitting**: Each route loads only when needed
- **Type safety**: Compile-time route validation
- **Smaller bundles**: Tree-shaking of unused routes
- **Better caching**: Route-based cache invalidation
- **Development speed**: Hot module replacement for route changes

## Testing

To test the routing system:

1. **Development**: Run `npm run dev` and navigate between all sections
2. **Type checking**: TypeScript validates all route references
3. **Browser testing**: Test back/forward buttons, direct URL access, bookmarking
4. **DevTools**: Use TanStack Router DevTools for debugging
5. **Route generation**: Check that `routeTree.gen.ts` updates automatically
