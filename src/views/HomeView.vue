<script setup>
import { ref } from 'vue'
import { searchMovies } from '../services/tmdb'
import MovieSearchForm from '../components/movies/MovieSearchForm.vue'
import MovieList from '../components/movies/MovieList.vue'

const movies = ref([])
const loading = ref(false)
const error = ref('')
const hasSearched = ref(false)

async function runSearch(filters) {
  loading.value = true
  error.value = ''
  hasSearched.value = true

  try {
    movies.value = await searchMovies(filters)
  } catch (err) {
    movies.value = []
    error.value = err instanceof Error
      ? err.message === 'TMDB token is missing'
        ? 'The TMDB access token is missing. Add VITE_TMDB_TOKEN to your .env file and restart the development server.'
        : 'We could not search TMDB right now. Check your connection and try again.'
      : 'An unexpected error occurred while searching.'
    console.error('Movie search failed:', err)
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  movies.value = []
  error.value = ''
  hasSearched.value = false
}
</script>

<template>
  <section class="home-view">

    <MovieSearchForm :loading="loading" @search="runSearch" @reset="resetSearch" />

    <section v-if="hasSearched" class="results-section">
      <div class="results-heading">
        <div>
          <h2 class="section-heading">Search results</h2>
          <p class="results-subtitle" v-if="!loading && !error">
            {{ movies.length }} {{ movies.length === 1 ? 'movie' : 'movies' }} found
          </p>
        </div>
      </div>
      <MovieList
        :movies="movies"
        mode="search"
        :loading="loading"
        :error="error"
        empty-message="No movies matched those filters. Try a different title, director, genre, or year."
      />
    </section>
  </section>
</template>

<style scoped>

.results-section { margin-top: 28px; }
.results-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.results-heading .section-heading { margin: 0 0 5px; }
.results-subtitle { margin: 0 0 15px; color: #838493; font-size: 0.85rem; }
</style>
