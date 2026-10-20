# CineShelf

CineShelf is a web application developed using Vue.js that allows users to discover movies and manage their personal movie collection.

This project was developed as part of a university assignment focused on UI/UX design, frontend development, API integration, state management, and data persistence.

## Features

### Movie Search
- Search for movies using the TMDB API.
- Search by title, director, genre, or release year.
- Combine search filters.
- Display movie posters, titles, directors, release years, and descriptions.
- Add movies directly from search results.
- View detailed movie information.

Search results are limited to 10 movies per request.

### Personal Library
- View saved movies.
- Remove movies from the library.
- Mark movies as watched or unwatched.
- Add or remove movies from favorites.
- Rate movies from 1 to 5 stars.
- Filter and sort the collection.
- Search within the personal library.
- Save the collection using localStorage.

### Favorites
- View all favorite movies on a dedicated page.
- Manage favorites using Vuex.
- Automatically update the favorites collection when a movie's favorite status changes.

### Advanced Features
The application implements four advanced feature categories:

1. **Filters and sorting:** Filter by favorites, watched status, or rating; search the library; sort by title, year, rating, or date added.
2. **Movie details:** Dynamic routes using Vue Router and additional movie information retrieved from TMDB.
3. **Rating system:** Personal ratings from 1 to 5 stars, saved using Vuex and localStorage.
4. **Library statistics:** Total movies, watched movies, remaining movies, favorites, and average personal rating.

The application also includes responsive layouts, loading indicators, error messages, empty states, and duplicate prevention.

## Technologies

- **Vue.js 3** — Frontend framework
- **Vue Router 4** — Page navigation
- **Vuex 4** — State management
- **Vite** — Development and build tool
- **TMDB API** — External movie database
- **localStorage** — Data persistence
- **Figma** — UI/UX design and prototyping

## Project Structure

```text
src/
├── assets/          # Images and styles
├── components/      # Reusable Vue components
│   ├── layout/
│   ├── movies/
│   └── library/
├── views/           # Application pages
├── router/          # Vue Router configuration
├── store/           # Vuex store
├── services/        # TMDB API integration
├── App.vue
└── main.js
```

## Installation

### Prerequisites

- Node.js 20.19+ or 22.12+
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

**Security note:** Vite exposes `VITE_` environment variables to the browser. This configuration is intended for this educational project and should not be used to store confidential production credentials.

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

The production build will be generated in the `dist/` directory.

## Application Routes

| Route | Description |
|---|---|
| `/` | Home and movie search |
| `/library` | Personal movie library |
| `/favorites` | Favorite movies |
| `/movie/:id` | Movie details |

## Data Management

CineShelf uses Vuex to manage the user's personal collection.

The store provides:
- **State:** Saved movie collection.
- **Getters:** Favorites, watched movies, library statistics, and membership checks.
- **Mutations:** Add and remove movies, update favorite and watched status, and change ratings.
- **Actions:** Handle library operations and retrieve movie information when adding an item.

The collection is persisted using **localStorage**, allowing saved movies and personal preferences to remain available after refreshing the browser.

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

Both developers collaborated on integration, testing, and the final presentation.

## Development Status

**Core implementation complete.**

The application implements all mandatory functional requirements and four advanced feature categories.

Manual testing has covered:
- Movie searches and filters
- Adding and removing movies
- Favorite and watched status management
- Personal ratings
- Library filtering, sorting, and statistics
- Movie details and navigation
- localStorage persistence
- Responsive layouts on mobile and desktop

## API Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

TMDB: https://www.themoviedb.org/