import { createStore } from 'vuex'
import { getMovieDetails } from '../services/tmdb'

const STORAGE_KEY = 'cineshelf-library'

// Load the collection when the application starts
function loadLibrary() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved) return []

        const library = JSON.parse(saved)
        return Array.isArray(library) ? library : []
    } catch (error) {
        console.error('Failed to load library:', error)
        return []
    }
}

export default createStore({
    state: () => ({
        library: loadLibrary()
    }),

    getters: {
        favorites: (state) =>
            state.library.filter(movie => movie.favorite),

        watchedMovies: (state) =>
            state.library.filter(movie => movie.watched),

        unwatchedMovies: (state) =>
            state.library.filter(movie => !movie.watched),

        isInLibrary: (state) => (id) =>
            state.library.some(movie => movie.id === Number(id)),

        statistics: (state) => {
            const library = state.library
            const rated = library.filter(movie => movie.rating > 0)

            return {
                total: library.length,
                watched: library.filter(m => m.watched).length,
                remaining: library.filter(m => !m.watched).length,
                favorites: library.filter(m => m.favorite).length,
                averageRating: rated.length
                    ? rated.reduce((sum, m) => sum + m.rating, 0) / rated.length
                    : 0
            }
        }
    },

    mutations: {
        ADD_MOVIE(state, movie) {
            if (!state.library.some(m => m.id === movie.id)) {
                state.library.push(movie)
            }
        },

        REMOVE_MOVIE(state, id) {
            state.library = state.library.filter(m => m.id !== id)
        },

        TOGGLE_FAVORITE(state, id) {
            const movie = state.library.find(m => m.id === id)
            if (movie) movie.favorite = !movie.favorite
        },

        TOGGLE_WATCHED(state, id) {
            const movie = state.library.find(m => m.id === id)
            if (movie) movie.watched = !movie.watched
        },

        SET_RATING(state, { id, rating }) {
            const movie = state.library.find(m => m.id === id)

            if (movie && Number.isInteger(rating)
                && rating >= 0 && rating <= 5) {
                movie.rating = rating
            }
        }
    },

    actions: {
        async addMovie({ state, commit }, id) {
            const movieId = Number(id)

            if (state.library.some(m => m.id === movieId)) {
                return false
            }

            const details = await getMovieDetails(movieId)

            commit('ADD_MOVIE', {
                ...details,
                watched: false,
                favorite: false,
                rating: 0,
                addedAt: new Date().toISOString()
            })

            return true
        },

        removeMovie({ commit }, id) {
            commit('REMOVE_MOVIE', Number(id))
        },

        toggleFavorite({ commit }, id) {
            commit('TOGGLE_FAVORITE', Number(id))
        },

        toggleWatched({ commit }, id) {
            commit('TOGGLE_WATCHED', Number(id))
        },

        setRating({ commit }, payload) {
            commit('SET_RATING', {
                id: Number(payload.id),
                rating: payload.rating
            })
        }
    },

    plugins: [
        (store) => {
            store.subscribe((_mutation, state) => {
                try {
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(state.library)
                    )
                } catch (error) {
                    console.error('Failed to save library:', error)
                }
            })
        }
    ]
})
