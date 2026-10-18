
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
    movie.value
        ? store.getters.isInLibrary(movie.value.id)
        : false
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
    if (!movie.value || isInLibrary.value || adding.value) {
        return
    }

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
        <RouterLink to="/">
            Back to search
        </RouterLink>

        <p v-if="loading">Loading movie details...</p>

        <p v-if="error">{{ error }}</p>

        <div v-if="movie">
            <h1>{{ movie.title }}</h1>

            <img
                v-if="movie.poster"
                :src="getPosterUrl(movie.poster)"
                :alt="movie.title"
                width="250"
            />

            <p><strong>Director:</strong> {{ movie.director }}</p>
            <p><strong>Year:</strong> {{ movie.year }}</p>
            <p><strong>Genres:</strong> {{ movie.genres.join(', ') }}</p>
            <p><strong>Runtime:</strong> {{ movie.runtime }} min</p>

            <h2>Overview</h2>
            <p>{{ movie.overview }}</p>

            <button
                :disabled="isInLibrary || adding"
                @click="addToLibrary"
            >
                {{ isInLibrary
                    ? 'Already in library'
                    : adding
                        ? 'Adding...'
                        : 'Add to Library'
                }}
            </button>
        </div>
    </section>
</template>
<style scoped>
h1 {color: #242530;}
</style>