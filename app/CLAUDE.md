# MemoryMatch - Picture Matching Game UI

## Project Summary
MemoryMatch is a Next.js-based memory card matching game with Auth0 authentication and Google Drive integration. Players flip cards to find matching image pairs against a 3-minute timer, earning scores based on speed and accuracy.

## Core Architecture

### Tech Stack
- **Framework**: Next.js 16.2.0 + React 19.2.4 + TypeScript
- **State**: Zustand (game store)
- **Styling**: Tailwind CSS + Radix UI components
- **Animations**: Framer Motion
- **Auth**: Auth0 + Google OAuth2
- **API**: Google Drive API v3

### Key Directories
- `/app` - Next.js pages (game, settings, home) + API routes
- `/components` - UI components and reusable React components
- `/lib` - Game logic store, Auth0 config, utilities
- `/public/cards` - Default card images

## Game Mechanics

### Difficulty Levels
- **Easy**: 3 pairs, ~5 second reveal time
- **Medium**: 5 pairs
- **Hard**: 7 pairs (may not be fully implemented)

### Game Flow
1. Countdown (0-3s)
2. Card reveal (3-5s) - shows all cards for memorization
3. Gameplay (5-180s) - player flips cards to find matches
4. End state - win or loss based on time

### Scoring
- 100 points per matched pair
- Time bonus: remaining seconds added on win

## State Management (Zustand Store)

**Location**: `lib/game-store.ts`

Store tracks:
- `difficulty` - current game difficulty
- `isGoogleDriveConnected` - authentication status
- `googleDriveFolderName` - selected folder name
- `customImages` - array of image URLs from Google Drive
- Default images fallback: `/cards/cat.jpg`, `/cards/dog.jpg`, etc.

## Authentication & Google Drive

**Auth Config**: `lib/auth0.ts`
- Auth0 client with Google OAuth2 connection
- Scopes include: `https://www.googleapis.com/auth/drive.readonly`

**API Routes**:
- `GET /api/google-drive?folder={name}` - search for folder, list images
- `GET /api/google-drive/file/[id]` - proxy image file access

## Pages

### `/` (Home/Landing)
- Hero section with game title
- Difficulty selection (Easy/Medium)
- How-to-play section with rules
- Link to start game

### `/game` (Game Page)
- Main game board with card grid
- Timer display
- Score tracking
- Match counter
- Win/loss screens
- Reset/home navigation

### `/settings` (Settings Page)
- Google Drive connection UI
- Folder name input
- Load custom images button
- Display loaded images
- Disconnect option
- Logout functionality

## Component Organization

### Main Components
- `card-animation.tsx` - Animated card preview for hero
- `header.tsx` - Navigation header with Auth0 login/logout
- `settings-content.tsx` - Google Drive settings form
- `theme-provider.tsx` - Next Themes wrapper

### UI Library Components
Radix UI wrapper components in `/components/ui/` (100+ components available)

## Important Implementation Details

### Card Matching Logic
- Two cards max flipped at once
- 1-second delay before flip-back on mismatch
- Prevents rapid clicks with `isProcessing` state
- Matched cards stay revealed permanently

### Image Handling
- Priority: Custom Google Drive images → Default local images
- Google Drive images proxied through `/api/google-drive/file/[id]`
- Allows access to private Drive files via bearer token

### Game Loop
- Countdown timer: 1s increments
- Game timer: 1s decrements when state is 'playing'
- Win condition: `matchedPairs >= config.pairs`
- Loss condition: `timeLeft <= 0`

## Common Tasks

### Adding New Difficulty
1. Add level to `DIFFICULTY_CONFIG` in `lib/game-store.ts`
2. Add option to difficulty selector on home page
3. Adjust timing constants if needed

### Changing Default Images
- Edit `DEFAULT_IMAGES` array in `lib/game-store.ts`
- Add images to `/public/cards/`

### Customizing Game Timing
- `GAME_DURATION` - total game time (default: 180s)
- `REVEAL_TIME` - initial card reveal duration (default: 2000ms)
- `FLIP_BACK_TIME` - time before cards flip back on mismatch (default: 1000ms)

## Known Considerations

- Hard difficulty partially implemented (config exists but not accessible in UI)
- Google Drive integration requires proper Auth0 + Google OAuth setup
- Images must be loaded from same session; no persistence across sessions
- Game state resets on page refresh (no save/resume)
