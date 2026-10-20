<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getMovieDetails, getPosterUrl } from '../services/tmdb'

const route = useRoute()
const store = useStore()
const movie = ref(null)
const loading = ref(false)
const adding = ref(false)
const error = ref(null)

const isInLibrary = computed(() =>
  movie.value ? store.getters.isInLibrary(movie.value.id) : false
)

// Fetch details when the movie ID changes
watch(
  () => route.params.id,
  async (id, _oldId, onCleanup) => {
    let cancelled = false
    onCleanup(() => { cancelled = true })
    movie.value = null
    error.value = null
    loading.value = true
    try {
      const result = await getMovieDetails(id)
      if (!cancelled) movie.value = result
    } catch (err) {
      if (!cancelled) {
        error.value = 'Unable to load movie details.'
        console.error(err)
      }
    } finally {
      if (!cancelled) loading.value = false
    }
  },
  { immediate: true }
)

// Add movie to the personal library
async function addToLibrary() {
  if (!movie.value || isInLibrary.value || adding.value) return
  adding.value = true
  error.value = null
  try {
    await store.dispatch('addMovie', movie.value.id)
  } catch (err) {
    error.value = 'Unable to add this movie.'
    console.error(err)
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <section class="movie-details">
    <RouterLink to="/" class="back-link">
      <span aria-hidden="true">←</span>
      Back to search
    </RouterLink>
    <div v-if="loading" class="state-panel" role="status">
      <span class="loader" aria-hidden="true"></span>
      <p>Loading movie details...</p>
    </div>
    <div v-if="error" class="error-panel" role="alert">
      {{ error }}
    </div>
    <div v-if="movie" class="details-card">
      <div class="movie-main">

        <!-- Poster -->
        <div class="poster-container">
          <img
            v-if="movie.poster"
            :src="getPosterUrl(movie.poster)"
            :alt="`${movie.title} poster`"
            class="movie-poster"
          />
          <div v-else class="poster-placeholder">
            No poster available
          </div>
        </div>

        <!-- Movie information -->
        <div class="movie-info">
          <h1>{{ movie.title }}</h1>
          <div class="movie-metadata">
            <span v-if="movie.year" class="meta-tag">
              {{ movie.year }}
            </span>
            <span v-if="movie.runtime" class="meta-tag">
              {{ movie.runtime }} min
            </span>
          </div>
          <div class="info-group">
            <span class="info-label">Directed by</span>
            <p class="director-name">{{ movie.director }}</p>
          </div>
          <div v-if="movie.genres?.length" class="info-group">
            <span class="info-label">Genres</span>
            <div class="genres-list">
              <span
                v-for="genre in movie.genres"
                :key="genre"
                class="genre-tag"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <!-- Library action -->
          <div class="library-action">
            <button
              class="add-button"
              type="button"
              :disabled="isInLibrary || adding"
              @click="addToLibrary"
            >
              {{
                isInLibrary
                  ? '✓ Already in library'
                  : adding
                    ? 'Adding...'
                    : '+ Add to Library'
              }}
            </button>
            <p class="action-note">
              {{
                isInLibrary
                  ? 'This movie is saved in your collection.'
                  : 'Save this movie to your personal collection.'
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Overview -->
      <div class="movie-overview">
        <h2>Overview</h2>
        <p>{{ movie.overview || 'No description available.' }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.movie-details { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 35px 0 70px; color: #242530; }
.back-link { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 25px; color: #6558d3; font-size: 0.9rem; font-weight: 600; text-decoration: none; }
.back-link:hover { color: #5144bc; }
.back-link span { font-size: 1.3rem; }
.details-card { overflow: hidden; border: 1px solid #e8e9f1; background: white; box-shadow: 0 8px 28px rgba(33, 34, 54, 0.04); }
.movie-main { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 35px; padding: 30px; }
.poster-container { width: 100%; }
.movie-poster { display: block; width: 100%; height: auto; aspect-ratio: 2 / 3; object-fit: cover; }
.poster-placeholder { display: flex; aspect-ratio: 2 / 3; align-items: center; justify-content: center; background: #eeedf6; color: #858696; text-align: center; }
.movie-info { display: flex; min-width: 0; flex-direction: column; align-items: flex-start; }
.movie-info h1 { margin: 0 0 15px; color: #242530; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.045em; }
.movie-metadata { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 30px; }
.meta-tag { background: #f2f1ff; padding: 7px 12px; color: #6558d3; font-size: 0.85rem; font-weight: 700; }
.info-group { margin-bottom: 24px; }
.info-label { display: block; margin-bottom: 8px; color: #858695; font-size: 0.78rem; font-weight: 700; }
.director-name { margin: 0; color: #343541; font-size: 1.1rem; font-weight: 600; }
.genres-list { display: flex; flex-wrap: wrap; gap: 8px; }
.genre-tag { border: 1px solid #e7e4ff; background: #f7f6ff; padding: 7px 11px; color: #6558d3; font-size: 0.8rem; font-weight: 600; }
.library-action { width: 100%; margin-top: auto; padding-top: 20px; }
.add-button { display: inline-flex; min-height: 46px; align-items: center; justify-content: center; border: 1px solid #6558d3; background: #6558d3; padding: 12px 22px; color: white; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: background 150ms ease; }
.add-button:hover:not(:disabled) { background: #5144bc; }
.add-button:disabled { border-color: #e2e3ec; background: #f3f3f7; color: #858696; cursor: not-allowed; }
.action-note { margin: 16px 0 0; color: #858695; font-size: 0.78rem; line-height: 1.6; }
.movie-overview { border-top: 1px solid #e8e9f1; padding: 28px 30px 35px; }
.movie-overview h2 { margin: 0 0 14px; color: #242530; font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; }
.movie-overview p { max-width: 850px; margin: 0; color: #6f7080; font-size: 0.95rem; line-height: 1.8; }
.state-panel { display: flex; min-height: 200px; align-items: center; justify-content: center; flex-direction: column; gap: 15px; color: #737585; }
.loader { width: 30px; height: 30px; border: 3px solid #e6e3ff; border-top-color: #6558d3; border-radius: 50%; animation: spin 0.75s linear infinite; }
.error-panel { border: 1px solid #f0c9ce; background: #fff7f8; padding: 18px; color: #9c3442; font-size: 0.9rem; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 750px) {
  .movie-main { grid-template-columns: 180px minmax(0, 1fr); gap: 22px; padding: 22px; }
  .movie-info h1 { font-size: 1.8rem; }
  .movie-overview { padding: 25px 22px; }
}
@media (max-width: 520px) {
  .movie-details { width: calc(100% - 28px); padding-top: 22px; }
  .movie-main { grid-template-columns: 1fr; padding: 18px; }
  .poster-container { max-width: 210px; margin: 0 auto; }
  .movie-info h1 { font-size: 1.75rem; }
  .movie-metadata { margin-bottom: 25px; }
  .library-action { padding-top: 10px; }
  .add-button { width: 100%; }
  .movie-overview { padding: 22px 18px; }
}
</style>
