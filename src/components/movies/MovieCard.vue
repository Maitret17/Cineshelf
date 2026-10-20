<script setup>
import { computed } from 'vue'
import { getPosterUrl } from '../../services/tmdb'
import FavoriteButton from './FavoriteButton.vue'
import RatingStars from './RatingStars.vue'
import WatchedCheckbox from './WatchedCheckbox.vue'

const props = defineProps({
  movie: { type: Object, required: true },
  mode: { type: String, default: 'library' },
  inLibrary: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-favorite', 'toggle-watched', 'rate', 'remove', 'add'])

const showLibraryActions = computed(() => props.mode === 'library' || props.mode === 'favorites' )
const genresText = computed(() => Array.isArray(props.movie.genres) ? props.movie.genres.join(' · ') : '')
const posterUrl = computed(() => getPosterUrl(props.movie.poster))

function rate(rating) {
  emit('rate', { id: props.movie.id, rating })
}
</script>

<template>
  <article class="movie-card">
    <RouterLink class="poster-link" :to="`/movie/${movie.id}`" :aria-label="`View details for ${movie.title}`">
      <div class="poster-frame">
        <img v-if="posterUrl" :src="posterUrl" :alt="`${movie.title} poster`" loading="lazy" />
        <div v-else class="poster-placeholder" aria-label="No poster available">
          <span aria-hidden="true">▧</span>
          <small>No poster</small>
        </div>
        <span v-if="movie.watched && showLibraryActions" class="watched-badge">✓ Watched</span>
      </div>
    </RouterLink>

    <div class="movie-content">
      <div class="movie-heading">
        <div class="movie-title-wrap">
          <RouterLink class="movie-title" :to="`/movie/${movie.id}`">{{ movie.title }}</RouterLink>
          <p class="movie-meta">
            <span>{{ movie.year || 'Year unknown' }}</span>
            <template v-if="movie.director">
              <span aria-hidden="true">·</span>
              <span class="director">{{ movie.director }}</span>
            </template>
          </p>
        </div>
        <span v-if="movie.rating > 0 && showLibraryActions" class="rating-pill">★ {{ movie.rating }}/5</span>
      </div>

      <p v-if="genresText" class="movie-genres">{{ genresText }}</p>
      <p v-if="movie.overview" class="movie-overview">{{ movie.overview }}</p>

      <div class="movie-card-bottom">
        <div v-if="showLibraryActions" class="movie-actions">
          <FavoriteButton
            :favorite="Boolean(movie.favorite)"
            @toggle="emit('toggle-favorite', movie.id)"
          />
          <WatchedCheckbox
            :watched="Boolean(movie.watched)"
            @toggle="emit('toggle-watched', movie.id)"
          />
          <div class="rating-row">
            <span class="action-label">Your rating</span>
            <RatingStars :rating="Number(movie.rating || 0)" @update:rating="rate" />
          </div>
        </div>

        <div class="card-footer-row">
          <RouterLink class="details-link" :to="`/movie/${movie.id}`">
            View details <span aria-hidden="true">→</span>
          </RouterLink>
          <button
            v-if="mode === 'search'"
            class="add-button"
            type="button"
            :disabled="inLibrary"
            @click="emit('add', movie.id)"
          >
            {{ inLibrary ? 'Already in library' :  'Add to library' }}

          </button>

          <button
            v-if="showLibraryActions"
            class="remove-button"
            type="button"
            :aria-label="`Remove ${movie.title} from library`"
            @click="emit('remove', movie.id)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.movie-card {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid #e8e9f1;
  border-radius: 0px;
  background: #fff;
  box-shadow: 0 6px 22px rgba(33, 34, 54, 0.035);
  transition: box-shadow 160ms ease, transform 160ms ease;
}

.movie-card:hover { box-shadow: 0 12px 28px rgba(33, 34, 54, 0.09); transform: translateY(-1px); }
.poster-link { display: block; min-height: 100%; text-decoration: none; }
.poster-frame { position: relative; height: 100%; min-height: 215px; background: #eeedf6; }
.poster-frame img { display: block; width: 100%; height: 100%; min-height: 215px; object-fit: cover; }
.poster-placeholder { display: flex; min-height: 215px; height: 100%; align-items: center; justify-content: center; flex-direction: column; gap: 7px; color: #9997b5; }
.poster-placeholder span { font-size: 2rem; }
.poster-placeholder small { font-size: 0.78rem; }
.watched-badge { position: absolute; top: 10px; left: 9px; border-radius: 0px; background: rgba(33, 132, 91, 0.95); padding: 5px 7px; color: #fff; font-size: 0.68rem; font-weight: 700; }
.movie-content { display: flex; min-width: 0; flex-direction: column; padding: 16px 17px 13px; }
.movie-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.movie-title-wrap { min-width: 0; }
.movie-title { display: -webkit-box; overflow: hidden; color: #242530; font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; line-height: 1.35; text-decoration: none; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.movie-title:hover { color: #5d50c7; }
.movie-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 6px 0 0; color: #858695; font-size: 0.78rem; }
.director { max-width: 100%; }
.rating-pill { flex: 0 0 auto; border-radius: 0px; background: #fff6d9; padding: 5px 7px; color: #9a7216; font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
.movie-genres { margin: 11px 0 0; color: #6358c5; font-size: 0.77rem; font-weight: 600; }
.movie-overview { display: -webkit-box; overflow: hidden; margin: 10px 0 13px; color: #6f7080; font-size: 0.83rem; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.movie-card-bottom { margin-top: auto; }
.movie-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 9px 13px; border-top: 1px solid #f0f0f5; padding-top: 12px; }
.rating-row { display: flex; width: 100%; align-items: center; flex-wrap: wrap; gap: 4px 8px; }
.action-label { color: #858695; font-size: 0.75rem; font-weight: 600; }
.card-footer-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 13px; padding-top: 11px; border-top: 1px solid #f0f0f5; }
.details-link { color: #5d50c7; font-size: 0.83rem; font-weight: 700; text-decoration: none; }
.details-link:hover { color: #3f34a4; }
.details-link span { padding-left: 3px; }
.remove-button { border: 0; background: transparent; padding: 5px 0 5px 8px; color: #b34b5a; font-size: 0.78rem; font-weight: 600; }
.remove-button:hover { color: #8f2434; text-decoration: underline; }
.add-button { border: 1px solid #6558d3; border-radius: 0; background: #6558d3; padding: 9px 14px; color: white; font-size: 0.82rem; font-weight: 700; cursor: pointer; }
.add-button:hover:not(:disabled) { background: #5144bc; }
.add-button:disabled { background: #efedff; border-color: #efedff;  color: #8580b3; cursor: not-allowed; }
@media (max-width: 600px) {
  .movie-card { grid-template-columns: 105px minmax(0, 1fr); }
  .poster-frame, .poster-frame img, .poster-placeholder { min-height: 175px; }
  .movie-content { padding: 12px 12px 11px; }
  .movie-title { font-size: 0.98rem; }
  .movie-overview { -webkit-line-clamp: 2; font-size: 0.8rem; }
  .movie-actions { gap: 8px; }
}
</style>
