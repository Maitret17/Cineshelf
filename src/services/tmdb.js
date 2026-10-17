
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// Generic function for making requests to TMDB
async function request(endpoint, params = {}) {
    if (!TOKEN) {
        throw new Error("TMDB token is missing");
    }

    const url = new URL(`${BASE_URL}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
    }

    return await response.json();
}

// Search movies by title
export async function searchMovies(query) {
    if (!query.trim()) {
        return [];
    }

    const data = await request("/search/movie", {
        query: query.trim(),
        language: "en-US"
    });

    return data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date
            ? Number(movie.release_date.slice(0, 4))
            : null,
        poster: movie.poster_path,
        overview: movie.overview,
        director: null
    }));
}

// Get detailed information about a movie
export async function getMovieDetails(id) {
    const movie = await request(`/movie/${id}`, {
        append_to_response: "credits",
        language: "en-US"
    });

    const directors = movie.credits?.crew
        ?.filter(person => person.job === "Director")
        .map(person => person.name) ?? [];

    return {
        id: movie.id,
        title: movie.title,
        director: directors.join(", ") || "Unknown",
        year: movie.release_date
            ? Number(movie.release_date.slice(0, 4))
            : null,
        poster: movie.poster_path,
        overview: movie.overview,
        genres: movie.genres.map(genre => genre.name),
        runtime: movie.runtime
    };
}

// Convert poster path into a complete URL
export function getPosterUrl(path) {
    if (!path) {
        return null;
    }

    return `https://image.tmdb.org/t/p/w500${path}`;
}
