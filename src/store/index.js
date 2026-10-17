
import { createStore } from "vuex";
import { getMovieDetails } from "../services/tmdb";

const STORAGE_KEY = "cineshelf-library";

function loadLibrary() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
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

    statistics: (state) => {
      const movies = state.library;
      const rated = movies.filter(m => m.rating > 0);

      return {
        total: movies.length,
        watched: movies.filter(m => m.watched).length,
        remaining: movies.filter(m => !m.watched).length,
        favorites: movies.filter(m => m.favorite).length,
        averageRating: rated.length
          ? rated.reduce((sum, m) => sum + m.rating, 0) / rated.length
          : 0
      };
    }
  },

  mutations: {
    ADD_MOVIE(state, movie) {
      state.library.push(movie);
    },

    REMOVE_MOVIE(state, id) {
      state.library = state.library.filter(m => m.id !== id);
    },

    TOGGLE_FAVORITE(state, id) {
      const movie = state.library.find(m => m.id === id);
      if (movie) movie.favorite = !movie.favorite;
    },

    TOGGLE_WATCHED(state, id) {
      const movie = state.library.find(m => m.id === id);
      if (movie) movie.watched = !movie.watched;
    },

    SET_RATING(state, { id, rating }) {
      const movie = state.library.find(m => m.id === id);
      if (movie && Number.isInteger(rating) &&
          rating >= 0 && rating <= 5) {
        movie.rating = rating;
      }
    }
  },

  actions: {
    async addMovie({ state, commit }, id) {
      if (state.library.some(movie => movie.id === id)) {
        return false;
      }

      const details = await getMovieDetails(id);

      commit("ADD_MOVIE", {
        ...details,
        watched: false,
        favorite: false,
        rating: 0,
        addedAt: new Date().toISOString()
      });

      return true;
    }
  },

  plugins: [
    store => {
      store.subscribe((_mutation, state) => {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(state.library)
        );
      });
    }
  ]
});
