# MemoryMatch - Picture Matching Game UI

A modern, interactive picture matching game built with Next.js, React, and Auth0. Test your memory skills by flipping cards and finding matching pairs against the clock. Features difficulty levels, Google Drive integration for custom images, and responsive design.

## Project Overview

**MemoryMatch** is a full-featured memory card matching game with the following capabilities:

- **Three Difficulty Levels**: Easy (3 pairs), Medium (5 pairs), Hard (7 pairs)
- **Timed Gameplay**: 3-minute timer with score bonuses for quick matches
- **Auth0 Integration**: Secure authentication with google-oauth2 connection
- **Google Drive Support**: Load custom card images from your Google Drive folders
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful UI**: Built with Radix UI components and Tailwind CSS
- **Smooth Animations**: Powered by Framer Motion for fluid interactions

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Authentication**: Auth0 Next.js SDK
- **API Integration**: Google Drive API v3
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

## Project Structure

```
├── app/                           # Next.js app directory
│   ├── page.tsx                   # Home/landing page
│   ├── game/page.tsx              # Main game page
│   ├── settings/page.tsx          # Settings page
│   ├── layout.tsx                 # Root layout with Auth0 setup
│   ├── globals.css                # Global styles
│   └── api/
│       └── google-drive/          # Google Drive API routes
│           ├── route.ts           # Fetch folders and images
│           └── file/[id]/route.ts # Proxy image file access
├── components/
│   ├── card-animation.tsx         # Animated card preview component
│   ├── header.tsx                 # Navigation header
│   ├── settings-content.tsx       # Google Drive settings UI
│   ├── theme-provider.tsx         # Next Themes setup
│   └── ui/                        # Radix UI component wrappers
├── lib/
│   ├── auth0.ts                   # Auth0 client configuration
│   ├── game-store.ts              # Zustand game state store
│   └── utils.ts                   # Utility functions
├── hooks/
│   ├── use-mobile.ts              # Mobile detection hook
│   └── use-toast.ts               # Toast notification hook
└── public/cards/                  # Default card images
```

## Key Features

### Game Mechanics
- **Countdown Timer**: 3-second countdown before game starts with card reveal
- **Card Flipping**: Click cards to reveal images and find matches
- **Scoring System**: 100 points per match + time bonus for remaining seconds
- **Win/Loss Conditions**: Win by matching all pairs before time runs out

### Google Drive Integration
- Authenticate via Auth0 with Google OAuth
- Browse folders in Google Drive
- Load custom images from selected folders
- Images are proxied through the app API for secure access

### State Management
- Zustand store tracks:
  - Game difficulty setting
  - Google Drive connection status
  - Custom image URLs
  - Game configuration by difficulty

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Auth0 account and application setup
- Google OAuth credentials configured in Auth0

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables (create .env.local)
# AUTH0_SECRET=your_secret
# AUTH0_BASE_URL=http://localhost:3000
# AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.auth0.com
# AUTH0_CLIENT_ID=your_client_id
# AUTH0_CLIENT_SECRET=your_client_secret
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## API Routes

### `GET /api/google-drive`
Searches Google Drive for folders and images
- **Query Params**: `folder` (folder name to search)
- **Response**: List of image files in the folder

### `GET /api/google-drive/file/[id]`
Proxies secure access to private Google Drive image files
- **Params**: `id` (file ID from Google Drive)
- **Response**: Image file with proper content type

## Core Game Logic

### Card Initialization
- Creates card pairs based on difficulty level
- Uses default images or custom Google Drive images
- Shuffles card positions for randomization

### Game Flow
1. **Countdown** (0-3s): Display countdown, show all cards
2. **Reveal** (3s-5s): Keep cards revealed for memorization
3. **Playing** (5s-180s): Player flips cards to find matches
4. **End State**: Win (all matched) or Loss (time expired)

### Matching Logic
- Two cards are flipped at a time
- If images match: cards stay revealed, score updates
- If no match: cards flip back after 1 second
- Processing state prevents rapid successive clicks

## Customization

### Difficulty Configuration
Edit `lib/game-store.ts` `DIFFICULTY_CONFIG`:
```typescript
export const DIFFICULTY_CONFIG = {
  easy: { matches: 3, pairs: 3 },
  medium: { matches: 5, pairs: 5 },
  hard: { matches: 7, pairs: 7 },
}
```

### Default Images
Update `DEFAULT_IMAGES` array in `lib/game-store.ts` to change fallback card images.

## Built with v0

This repository is linked to a [v0](https://v0.app) project for continued development and automatic deployments.

[Continue working on v0 →](https://v0.app/chat/projects/prj_VLfFm7JkXQBwfzIrgkR3gP7tYkDD)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
