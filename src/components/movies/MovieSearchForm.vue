<script setup>
import { onMounted, ref } from 'vue'
import { getGenres } from '../../services/tmdb'

const props = defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['search', 'reset'])

const title = ref('')
const director = ref('')
const genre = ref('')
const year = ref('')
const genres = ref([])
const genresLoading = ref(false)
const genreError = ref('')
const formError = ref('')

onMounted(async () => {
  genresLoading.value = true
  genreError.value = ''

  try {
    genres.value = await getGenres()
  } catch (error) {
    genreError.value = 'Genres could not be loaded. You can still search by title, director, or year.'
    console.error('Failed to load movie genres:', error)
  } finally {
    genresLoading.value = false
  }
})

function submitSearch() {
  formError.value = ''

  const filters = {
    title: title.value.trim(),
    director: director.value.trim(),
    genre: genre.value,
    year: year.value.trim()
  }

  if (!filters.title && !filters.director && !filters.genre && !filters.year) {
    formError.value = 'Enter at least one search filter to find movies.'
    return
  }

  emit('search', filters)
}

function resetForm() {
  title.value = ''
  director.value = ''
  genre.value = ''
  year.value = ''
  formError.value = ''
  emit('reset')
}
</script>

<template>
  <form class="search-panel" @submit.prevent="submitSearch">

    <div class="fields-grid">
      <div class="field">
        <label for="movie-title">Movie title</label>
        <input
          id="movie-title"
          v-model.trim="title"
          type="search"
          autocomplete="off"
          placeholder="e.g. Interstellar"
        />
      </div>

      <div class="field">
        <label for="movie-director">Director</label>
        <input
          id="movie-director"
          v-model.trim="director"
          type="text"
          autocomplete="off"
          placeholder="e.g. Christopher Nolan"
        />
      </div>

      <div class="field">
        <label for="movie-genre">Genre</label>
        <select id="movie-genre" v-model="genre" :disabled="genresLoading">
          <option value="">All genres</option>
          <option v-for="item in genres" :key="item.id" :value="String(item.id)">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="movie-year">Release year</label>
        <input
          id="movie-year"
          v-model="year"
          type="number"
          inputmode="numeric"
          min="1888"
          max="2100"
          placeholder="e.g. 2014"
        />
      </div>
    </div>

    <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
    <p v-if="genreError" class="genre-note" role="status">{{ genreError }}</p>

    <div class="form-actions">
      <button class="primary-button" type="submit" :disabled="props.loading">
        <span aria-hidden="true">⌕</span>
        {{ props.loading ? 'Searching…' : 'Search movies' }}
      </button>
      <button class="secondary-button" type="button" :disabled="props.loading" @click="resetForm">
        Reset filters
      </button>
    </div>
  </form>
</template>

<style scoped>
.search-panel {
  overflow: hidden;
  border: 1px solid #e8e9f1;
  border-radius: 0px;
  background: white;
  box-shadow: 0 10px 32px rgba(33, 34, 54, 0.045);
}

.form-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #f0f0f5;
  padding: 23px 25px 20px;
}
h2 { margin: 0; color: #242530; font-family: 'Space Grotesk', sans-serif; font-size: 1.35rem; letter-spacing: -0.035em; }
.fields-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; padding: 22px 25px 18px; }
.field { display: flex; min-width: 0; flex-direction: column; gap: 7px; }
label { color: #555665; font-size: 0.8rem; font-weight: 700; }
input, select { width: 100%; min-width: 0; height: 44px; border: 1px solid #e1e2eb; border-radius: 0px; outline: none; background: white; padding: 0 12px; color: #292a35; font-size: 0.88rem; }
input::placeholder { color: #a1a2af; }
input:focus, select:focus { border-color: #887ee2; outline: 3px solid rgba(101, 88, 211, 0.12); }
input:disabled, select:disabled { background: #f6f6fa; }
.form-error, .genre-note { margin: 0 25px 12px; font-size: 0.82rem; line-height: 1.5; }
.form-error { color: #b9384a; }
.genre-note { color: #8b6415; }
.form-actions { display: flex; flex-wrap: wrap; gap: 10px; border-top: 1px solid #f0f0f5; padding: 17px 25px 20px; }
.primary-button, .secondary-button { display: inline-flex; min-height: 43px; align-items: center; justify-content: center; gap: 8px; border-radius: 0px; padding: 0 17px; font-size: 0.88rem; font-weight: 700; transition: background 140ms ease; }
.primary-button { border: 1px solid #6558d3; background: #6558d3; color: white; }
.primary-button:hover:not(:disabled) { border-color: #5144bc; background: #5144bc; }
.primary-button span { font-size: 1.3rem; line-height: 1; }
.secondary-button { border: 1px solid #e2e3ec; background: white; color: #666777; }
.secondary-button:hover:not(:disabled) { background: #f7f7fb; }

@media (max-width: 900px) { .fields-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 520px) {
  .fields-grid { grid-template-columns: 1fr; padding: 18px 17px; }
  .form-actions { padding: 15px 17px 18px; }
  .form-error, .genre-note { margin-right: 17px; margin-left: 17px; }
  .primary-button, .secondary-button { flex: 1; }
}
</style>
