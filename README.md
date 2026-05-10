# SonicFlow (Frontend)

A stunning, premium music streaming web application built with React, Vite, and Vanilla CSS. Featuring a modern Spotify-inspired interface with advanced playback controls and seamless API integration.

## 🚀 Tech Stack

- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Modern Design System with Glassmorphism)
- **State Management**: Zustand
- **Audio Library**: Native HTML5 Audio
- **Icons**: Lucide React
- **Data Fetching**: Axios

## ✨ Features

- **Premium UI**: Modern dark mode with rich aesthetics, vibrant gradients, and smooth animations.
- **Music Playback**:
  - Shuffle & Repeat (None/One/All) modes.
  - Interactive Progress Bar & Volume Control.
  - Persistent playback state.
- **Discovery**:
  - Discovery feed from Jamendo.
  - Top Mix & Recommended tracks.
  - Global Search with real-time results.
- **Persistence**:
  - **Title-based Indexing**: Tracks are identified by title to ensure library consistency across sessions and refreshes.
  - **Persistent Session**: Automatic session restoration on refresh using secure JWT storage.
- **User Library**:
  - Create & manage Playlists.
  - Liked Songs with database persistence.
  - Recently Played history.

## 🛠️ Local Setup

1. **Clone the repository**
2. **Setup Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=your_backend_link
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run development server**:
   ```bash
   npm run dev
   ```

## 🚢 Deployment

Recommended platforms: **Vercel**, **Netlify**, or **Cloudflare Pages**.
- Ensure `VITE_API_BASE_URL` points to your production backend.
- Ensure the backend has your production domain in its `ALLOWED_ORIGINS`.

## 📂 Project Structure

- `/src/components`: Reusable UI components (Auth, Layout, Player).
- `/src/pages`: Application views (Home, Search, Profile, Login).
- `/src/store`: Zustand stores for player state and authentication.
- `/src/services`: API integration services.
- `/src/hooks`: Custom logic hooks.
