<script setup>
import MovieCard from './MovieCard.vue'

defineProps({
  movies: { type: Array, default: () => [] },
  mode: { type: String, default: 'library' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  emptyMessage: { type: String, default: 'No movies to show yet.' },
  libraryIds : { type: Array, default: () => [] },
})

const emit = defineEmits(['toggle-favorite', 'toggle-watched', 'rate', 'remove', 'add'])
</script>

<template>
  <div class="movie-list-wrapper">
    <div v-if="loading" class="state-panel" role="status">
      <span class="loader" aria-hidden="true"></span>
      <p>Loading movies…</p>
    </div>

    <div v-if="error" class="state-panel error-panel" role="alert">
      <strong>Something went wrong</strong>
      <p>{{ error }}</p>
    </div>

    <div v-if="!loading && movies.length === 0 && !error" class="state-panel empty-panel">
      <span class="empty-icon" aria-hidden="true">▤</span>
      <h2>Nothing here yet</h2>
      <p>{{ emptyMessage }}</p>
    </div>

    <div v-if="movies.length > 0 && !loading" class="movie-list">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :mode="mode"
        @toggle-favorite="emit('toggle-favorite', $event)"
        @toggle-watched="emit('toggle-watched', $event)"
        @rate="emit('rate', $event)"
        @remove="emit('remove', $event)"
        :in-library="libraryIds.includes(movie.id)"
        @add="emit('add', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.movie-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 17px;
}

.state-panel {
  display: flex;
  min-height: 170px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border: 1px dashed #dfe0eb;
  border-radius: 0px;
  background: rgba(255, 255, 255, 0.7);
  padding: 28px;
  color: #777887;
  text-align: center;
}

.state-panel p { margin: 0; font-size: 0.9rem; line-height: 1.6; }
.empty-panel h2 { margin: 3px 0 0; color: #343541; font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; }
.empty-icon { color: #a6a2de; font-size: 2rem; }
.error-panel { border-style: solid; border-color: #f0c9ce; background: #fff7f8; color: #9c3442; }
.error-panel strong { font-size: 0.95rem; }
.loader { width: 25px; height: 25px; border: 3px solid #e6e3ff; border-top-color: #6558d3; border-radius: 50%; animation: spin 0.75s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) { .movie-list { grid-template-columns: 1fr; } }
</style>
