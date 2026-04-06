# GameHub

GameHub is a modern game discovery web app built with React, TypeScript, Vite, and Chakra UI.  
It lets users explore games, view detailed game pages, manage a personal library, and enjoy a responsive gamer-style interface.

## GitHub Description

GameHub is a responsive game discovery and library management web app built with React, TypeScript, Vite, Chakra UI, and Zustand.

## Features

- Browse games in a clean grid layout
- Filter games by genre, platform, and sort order
- Search games instantly
- View detailed game pages with screenshots, ratings, and metadata
- Add games to wishlist, collection, backlog, and history
- Genre-based fallback artwork for games with missing images
- Dark and light theme support
- Mobile responsive layout
- Persistent library state using local storage

## Tech Stack

- React
- TypeScript
- Vite
- Chakra UI
- Framer Motion
- React Router
- Zustand
- React Icons

## Project Status

This project currently uses local mock data for the main game list and game details.  
The structure is also ready for API integration.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gamehub.git
cd gamehub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root:

```env
VITE_RAWG_API_KEY=your_api_key_here
```

Note: the current version mainly runs on mock data, but this variable is useful if you switch to live RAWG API integration.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Folder Structure

```bash
src/
  components/     # reusable UI components
  hooks/          # custom hooks
  mocks/          # mock game and detail data
  pages/          # route pages
  store/          # Zustand state management
  theme/          # Chakra UI theme config
  types/          # TypeScript types
  utils/          # helper utilities
```

## Highlights

- Gamer-style landing page
- Interactive library system
- Responsive game detail screen
- Smooth animations with Framer Motion
- Themed fallback game covers based on genre

## Future Improvements

- Connect fully to RAWG API
- Add trailers and video previews
- Add favorites/recommendation system
- Add authentication and cloud sync
- Add pagination with real backend data

## Author

Made by T Mano Sherin
