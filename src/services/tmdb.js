
const BASE_URL = 'https://api.themoviedb.org/3'
const TOKEN = import.meta.env.VITE_TMDB_TOKEN
const MAX_RESULTS = 10

let genresPromise = null

// Generic TMDB request
async function request(endpoint, params = {}) {
    if (!TOKEN) {
        throw new Error('TMDB token is missing')
    }

    const url = new URL(`${BASE_URL}${endpoint}`)

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.set(key, value)
        }
    })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`)
    }

    return response.json()
}

// Retrieve available genres for the search dropdown
export async function getGenres() {
    if (!genresPromise) {
        genresPromise = request('/genre/movie/list', {
            language: 'en-US'
        })
            .then(data => data.genres)
            .catch(error => {
                genresPromise = null
                throw error
            })
    }

    return genresPromise
}

// Find movies directed by a person
async function searchByDirector(name) {
    const people = await request('/search/person', {
        query: name,
        language: 'en-US'
    })

    const candidates = people.results || []
    const normalizedName = name.toLowerCase()

    const person =
        candidates.find(p =>
            p.name.toLowerCase() === normalizedName &&
            p.known_for_department === 'Directing'
        ) ||
        candidates.find(p =>
            p.name.toLowerCase() === normalizedName
        ) ||
        candidates.find(p =>
            p.known_for_department === 'Directing'
        )

    if (!person) {
        return { movies: [], directorName: null }
    }

    const credits = await request(
        `/person/${person.id}/movie_credits`,
        { language: 'en-US' }
    )

    const directedMovies = (credits.crew || [])
        .filter(movie => movie.job === 'Director')

    // A director may have several credits for the same movie
    const uniqueMovies = [
        ...new Map(
            directedMovies.map(movie => [movie.id, movie])
        ).values()
    ]

    return {
        movies: uniqueMovies.sort(
            (a, b) => (b.popularity || 0) - (a.popularity || 0)
        ),
        directorName: person.name
    }
}

// Retrieve directors from movie credits
async function getDirectors(id) {
    const credits = await request(`/movie/${id}/credits`)

    const directors = [
        ...new Set(
            (credits.crew || [])
                .filter(person => person.job === 'Director')
                .map(person => person.name)
        )
    ]

    return directors.join(', ') || 'Unknown'
}

// Normalize movie data for Vue components
function mapMovie(movie, director, genreMap) {
    return {
        id: movie.id,
        title: movie.title,
        director,
        year: movie.release_date
            ? Number(movie.release_date.slice(0, 4))
            : null,
        poster: movie.poster_path,
        overview: movie.overview,
        genres: (movie.genre_ids || [])
            .map(id => genreMap.get(id))
            .filter(Boolean)
    }
}

// Search movies using title, director, genre and year
export async function searchMovies(filters = {}) {
    // Keep compatibility with searchMovies("Interstellar")
    const options = typeof filters === 'string'
        ? { title: filters }
        : (filters || {})

    const title = String(options.title ?? '').trim()
    const director = String(options.director ?? '').trim()

    const rawGenre = options.genre ?? ''
    const rawYear = options.year ?? ''

    const genre = rawGenre === '' ? null : Number(rawGenre)
    const year = rawYear === '' ? null : Number(rawYear)

    if (genre !== null &&
        (!Number.isInteger(genre) || genre <= 0)) {
        throw new Error('Invalid genre ID')
    }

    if (year !== null &&
        (!Number.isInteger(year) || year < 1000 || year > 9999)) {
        throw new Error('Invalid release year')
    }

    if (!title && !director && !genre && !year) {
        return []
    }

    let movies = []
    let directorName = null

    if (director) {
        // Search using director credits
        const result = await searchByDirector(director)
        movies = result.movies
        directorName = result.directorName

    } else if (title) {
        // Search using movie title
        const data = await request('/search/movie', {
            query: title,
            language: 'en-US',
            year
        })

        movies = data.results || []

    } else {
        // Discover movies using genre and/or year
        const data = await request('/discover/movie', {
            language: 'en-US',
            with_genres: genre,
            primary_release_year: year,
            sort_by: 'popularity.desc'
        })

        movies = data.results || []
    }

    // Apply combined search filters
    movies = movies.filter(movie => {
        if (title && director) {
            const query = title.toLowerCase()
            const movieTitle = (movie.title || '').toLowerCase()
            const originalTitle =
                (movie.original_title || '').toLowerCase()

            if (!movieTitle.includes(query) &&
                !originalTitle.includes(query)) {
                return false
            }
        }

        if (genre && !(movie.genre_ids || []).includes(genre)) {
            return false
        }

        if (year) {
            const releaseYear = movie.release_date
                ? Number(movie.release_date.slice(0, 4))
                : null

            if (releaseYear !== year) {
                return false
            }
        }

        return true
    })

    movies = movies.slice(0, MAX_RESULTS)

    if (movies.length === 0) {
        return []
    }

    const genres = await getGenres()
    const genreMap = new Map(
        genres.map(g => [g.id, g.name])
    )

    // Retrieve director information
    return Promise.all(
        movies.map(async movie => {
            let movieDirector = directorName

            if (!movieDirector) {
                try {
                    movieDirector = await getDirectors(movie.id)
                } catch (error) {
                    console.warn(
                        `Could not load director for ${movie.id}`,
                        error
                    )
                    movieDirector = 'Unknown'
                }
            }

            return mapMovie(movie, movieDirector, genreMap)
        })
    )
}

// Get detailed information about a movie
export async function getMovieDetails(id) {
    const movie = await request(`/movie/${id}`, {
        append_to_response: 'credits',
        language: 'en-US'
    })

    const directors = [
        ...new Set(
            (movie.credits?.crew || [])
                .filter(person => person.job === 'Director')
                .map(person => person.name)
        )
    ]

    return {
        id: movie.id,
        title: movie.title,
        director: directors.join(', ') || 'Unknown',
        year: movie.release_date
            ? Number(movie.release_date.slice(0, 4))
            : null,
        poster: movie.poster_path,
        overview: movie.overview,
        genres: (movie.genres || []).map(g => g.name),
        runtime: movie.runtime
    }
}

// Convert TMDB poster path to complete image URL
export function getPosterUrl(path) {
    return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : null
}
