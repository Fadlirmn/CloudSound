# Music Player (Frontend)

A stunning, premium music streaming web application built with React, Vite, and Tailwind CSS. Featuring a modern Spotify-like interface with advanced playback controls and seamless API integration.

## 🚀 Tech Stack

- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Premium Dark Theme)
- **State Management**: Zustand
- **Audio Library**: Howler.js
- **Icons**: Lucide React
- **Data Fetching**: Axios & React Query

## ✨ Features

- **Premium UI**: Modern dark mode with glassmorphism and smooth animations.
- **Music Playback**:
  - Shuffle & Repeat (One/All) modes.
  - Interactive Progress Bar & Volume Control.
  - Playback Queue management.
- **Discovery**:
  - Browse by Genre.
  - Personalized recommendations based on activity.
  - Global Search.
- **User Library**:
  - Create & manage Playlists.
  - Liked Songs with local persistence and heart indicators.
- **Responsive**: Fully optimized for desktop and tablet layouts.

## 🛠️ Local Setup

1. **Clone the repository**
2. **Setup Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=/api/v1
   ```
   *(Note: The `/api` prefix is handled by the Vite proxy in development)*
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
- Set `VITE_API_BASE_URL` to your production backend URL (e.g., `https://api.myapp.com/v1`).
- Ensure the backend has your production domain in its `ALLOWED_ORIGINS`.

## 📂 Project Structure

- `/src/components`: Reusable UI components.
- `/src/pages`: Main application views (Home, Search, Library, etc.).
- `/src/store`: Zustand state management for player and auth.
- `/src/services`: API interaction logic.
- `/src/hooks`: Custom React hooks (e.g., audio progress, debounce).
