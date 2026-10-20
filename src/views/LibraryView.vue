<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import LibraryFilters from '../components/library/LibraryFilters.vue'
import LibraryStats from '../components/library/LibraryStats.vue'
import MovieList from '../components/movies/MovieList.vue'

const store = useStore()
const searchQuery = ref('')
const status = ref('all')
const sortBy = ref('recent')

const library = computed(() => store.state.library)
const stats = computed(() => store.getters.statistics)

const filteredMovies = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  const movies = library.value.filter(movie => {
    const matchesQuery = !query ||
      String(movie.title || '').toLowerCase().includes(query) ||
      String(movie.director || '').toLowerCase().includes(query)

    let matchesStatus = true
    if (status.value === 'unwatched') matchesStatus = !movie.watched
    if (status.value === 'watched') matchesStatus = Boolean(movie.watched)
    if (status.value === 'favorites') matchesStatus = Boolean(movie.favorite)
    if (status.value === 'rated') matchesStatus = Number(movie.rating) > 0

    return matchesQuery && matchesStatus
  })

  return [...movies].sort((a, b) => {
    if (sortBy.value === 'title') return String(a.title || '').localeCompare(String(b.title || ''))
    if (sortBy.value === 'year') return (Number(b.year) || 0) - (Number(a.year) || 0)
    if (sortBy.value === 'rating') return (Number(b.rating) || 0) - (Number(a.rating) || 0)
    return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime()
  })
})

function toggleFavorite(id) {
  store.dispatch('toggleFavorite', id)
}

function toggleWatched(id) {
  store.dispatch('toggleWatched', id)
}

function setRating({ id, rating }) {
  store.dispatch('setRating', { id, rating })
}

function removeMovie(id) {
  store.dispatch('removeMovie', id)
}

function clearFilters() {
  searchQuery.value = ''
  status.value = 'all'
  sortBy.value = 'recent'
}
</script>

<template>
  <section class="library-view">

    <LibraryStats :stats="stats" />

    <div class="library-section-heading">
      <div>
        <h2 class="section-heading">Your movies</h2>
        <p>{{ filteredMovies.length }} of {{ library.length }} {{ library.length === 1 ? 'movie' : 'movies' }}</p>
      </div>
    </div>

    <LibraryFilters
      v-model:search-query="searchQuery"
      v-model:status="status"
      v-model:sort-by="sortBy"
      @clear="clearFilters"
    />

    <div class="library-results">
      <MovieList
        :movies="filteredMovies"
        mode="library"
        :empty-message="library.length === 0
          ? 'Your library is empty. Search for a movie and add it from its details page.'
          : 'No movies match the selected filters. Clear the filters to see your full collection.'"
        @toggle-favorite="toggleFavorite"
        @toggle-watched="toggleWatched"
        @rate="setRating"
        @remove="removeMovie"
      />
    </div>
  </section>
</template>

<style scoped>
.library-section-heading { display: flex; align-items: center; justify-content: space-between; margin: 28px 0 14px; }
.library-section-heading .section-heading { margin: 0 0 4px; }
.library-section-heading p { margin: 0; color: #838493; font-size: 0.82rem; }
.library-results { margin-top: 18px; }

@media (max-width: 600px) {
  .view-heading-row { align-items: flex-start; flex-direction: column; }
  .browse-link { width: 100%; }
}
</style>
