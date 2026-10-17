
# CineShelf

CineShelf is a web application developed using Vue.js that allows users to discover movies and manage their personal movie collection.

This project is part of a university assignment focused on UI/UX design, frontend development, API integration, and state management.

## Features

### Movie Search
- Search for movies using the TMDB API.
- Search by title and explore movie information.
- Display movie posters, titles, directors, release years, and descriptions.
- Add movies to a personal library.

### Personal Library
- View saved movies.
- Remove movies from the library.
- Mark movies as watched or unwatched.
- Add or remove movies from favorites.
- Save the collection using localStorage.

### Favorites
- View all favorite movies.
- Manage favorites using Vuex.

### Additional Features
- Filter and sort the library.
- View detailed information about movies.
- Rate movies from 1 to 5 stars.
- View library statistics.

## Technologies

- **Vue.js 3** — Frontend framework
- **Vue Router 4** — Page navigation
- **Vuex 4** — State management
- **Vite** — Development and build tool
- **TMDB API** — Movie database
- **localStorage** — Data persistence
- **Figma** — UI/UX design and prototyping

## Project Structure

    src/
    ├── assets/          # Images and styles
    ├── components/      # Reusable Vue components
    │   ├── layout/
    │   ├── movies/
    │   ├── search/
    │   └── library/
    ├── views/           # Application pages
    ├── router/          # Vue Router configuration
    ├── store/           # Vuex store
    ├── services/        # TMDB API integration
    ├── utils/           # Utility functions
    ├── App.vue
    └── main.js

## Installation

### Prerequisites

- Node.js compatible with Vite 8 (20.19+ or 22.12+)
- npm
- A TMDB API Read Access Token

### 1. Clone the repository

```bash
git clone https://github.com/Maitret17/Cineshelf.git
cd Cineshelf
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add your TMDB API Read Access Token:

```env
VITE_TMDB_TOKEN=your_tmdb_read_access_token
```

You can obtain a token from:
https://www.themoviedb.org/settings/api

Do not commit `.env.local` to GitHub.

Note: Vite exposes `VITE_` variables to the browser. This configuration is intended for this educational project, not for securely storing production secrets.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

http://localhost:5173/

### 5. Build the application

```bash
npm run build
```

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Home and movie search |
| `/library` | Personal movie library |
| `/favorites` | Favorite movies |
| `/movie/:id` | Movie details |

## Team Organization

### Developer 1 — API and State Management
- TMDB API integration
- Vuex store
- localStorage persistence
- Movie details page
- Data management logic

### Developer 2 — UI/UX and Frontend
- Persona, wireframes, and Figma prototype
- Reusable Vue components
- Home and search interface
- Library and Favorites interfaces
- Filters, sorting, and statistics interface

Both developers collaborate on integration, testing, and the final presentation.

## Development Status

The project is currently under development.

The initial version establishes the Vue application structure, routing, and state management foundation.

Features will be implemented progressively using separate Git branches.

## API Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

TMDB: https://www.themoviedb.org/