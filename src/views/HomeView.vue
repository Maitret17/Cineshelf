<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { searchMovies } from '../services/tmdb'
import MovieSearchForm from '../components/movies/MovieSearchForm.vue'
import MovieList from '../components/movies/MovieList.vue'

const store = useStore()

const movies = ref([])
const loading = ref(false)
const error = ref('')
const actionError = ref('')
const hasSearched = ref(false)
const pendingIds = ref([])

const libraryIds = computed(() =>
  store.state.library.map(movie => movie.id)
)

const displayedMovies = computed(() => {
  const savedMovies = new Map(
    store.state.library.map(movie => [movie.id, movie])
  )

  return movies.value.map(movie =>
    savedMovies.get(movie.id) ?? movie
  )
})

async function runSearch(filters) {
  loading.value = true
  error.value = ''
  actionError.value = ''
  hasSearched.value = true

  try {
    movies.value = await searchMovies(filters)
  } catch (err) {
    movies.value = []
    error.value = err.message === 'TMDB token is missing'
      ? 'The TMDB access token is missing.'
      : 'We could not search TMDB right now.'
    console.error('Movie search failed:', err)
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  movies.value = []
  error.value = ''
  actionError.value = ''
  hasSearched.value = false
}

// Apply an action, adding the movie first if necessary
async function addMovie(id) {
  try {
    await store.dispatch('addMovie', id)
  } catch (err) {
    error.value = 'Unable to add this movie to your library.'
    console.error('Failed to add movie:', err)
  }
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
          <p v-if="actionError" class="action-error" role="alert">
            {{ actionError }}
          </p>
        </div>
      </div>
      <MovieList
        :movies="movies"
        mode="search"
        :loading="loading"
        :error="error"
        :library-ids="libraryIds"
        :pending-ids="pendingIds"
        empty-message="No movies matched those filters."
        @add="addMovie"
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
