
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

async function request(endpoint, params = {}) {
  if (!TOKEN) {
    throw new Error("Missing TMDB API token");
  }

  const url = new URL(BASE_URL + endpoint);

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
    throw new Error(`TMDB error: ${response.status}`);
  }

  return response.json();
}

export async function searchMovies(query) {
  if (!query.trim()) return [];

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
    overview: movie.overview
  }));
}

export async function getMovieDetails(id) {
  const movie = await request(`/movie/${id}`, {
    append_to_response: "credits",
    language: "en-US"
  });

  const director = movie.credits?.crew?.find(
    person => person.job === "Director"
  );

  return {
    id: movie.id,
    title: movie.title,
    director: director?.name || "Unknown",
    year: movie.release_date
      ? Number(movie.release_date.slice(0, 4))
      : null,
    poster: movie.poster_path,
    overview: movie.overview
  };
}

export function getPosterUrl(path) {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : null;
}
