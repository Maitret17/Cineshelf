<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import MovieList from '../components/movies/MovieList.vue'

const store = useStore()
const favorites = computed(() => store.getters.favorites)

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
</script>

<template>
  <section class="favorites-view">

    <div class="favorites-count">
      <span class="count-star" aria-hidden="true">★</span>
      <span><strong>{{ favorites.length }}</strong> {{ favorites.length === 1 ? 'favorite movie' : 'favorite movies' }}</span>
    </div>

    <MovieList
      :movies="favorites"
      mode="favorites"
      empty-message="You haven't marked any movies as favorites yet. Visit My Library and tap Favorite on a movie you love."
      @toggle-favorite="toggleFavorite"
      @toggle-watched="toggleWatched"
      @rate="setRating"
      @remove="removeMovie"
    />
  </section>
</template>

<style scoped>
.favorites-count { display: inline-flex; align-items: center; gap: 9px; margin: 28px 0 16px; border: 1px solid #f3d9e4; border-radius: 0px; background: #fff9fc; padding: 9px 12px; color: #7f4a61; font-size: 0.85rem; }
.count-star { color: #c44a7b; font-size: 1.1rem; }
.favorites-count strong { color: #3b2932; }
@media (max-width: 500px) { .favorite-mark { width: 53px; height: 53px; flex-basis: 53px; border-radius: 0px; font-size: 1.8rem; } }
</style>
