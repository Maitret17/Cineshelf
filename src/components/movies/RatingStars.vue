<script setup>
const props = defineProps({
  rating: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:rating', 'change'])

function chooseRating(value) {
  if (props.readonly || props.disabled) return
  const nextRating = props.rating === value ? 0 : value
  emit('update:rating', nextRating)
  emit('change', nextRating)
}
</script>

<template>
  <div class="rating-stars" :class="{ 'is-readonly': readonly }" :aria-label="`Rating: ${rating} out of 5`">
    <template v-for="star in 5" :key="star">
      <button
        v-if="!readonly"
        class="star-button"
        :class="{ selected: star <= rating }"
        type="button"
        :disabled="disabled"
        :aria-label="`Rate ${star} out of 5 stars`"
        :aria-pressed="rating === star"
        @click="chooseRating(star)"
      >
        {{ star <= rating ? '★' : '☆' }}
      </button>
      <span v-else class="star-display" :class="{ selected: star <= rating }" aria-hidden="true">
        {{ star <= rating ? '★' : '☆' }}
      </span>
    </template>
    <span v-if="!readonly" class="rating-hint">{{ rating > 0 ? `${rating}/5` : 'Rate this movie' }}</span>
    <span v-else class="rating-hint">{{ rating > 0 ? `${rating}/5` : 'Not rated' }}</span>
  </div>
</template>

<style scoped>
.rating-stars {
  display: flex;
  min-height: 25px;
  align-items: center;
  gap: 2px;
}

.star-button {
  border: 0;
  border-radius: 0px;
  background: transparent;
  padding: 0 1px;
  color: #c9cad5;
  font-size: 1.25rem;
  line-height: 1.15;
}

.star-button:hover,
.star-button.selected,
.star-display.selected { color: #e4a627; }

.star-button:focus-visible { outline: 2px solid #8c82e4; }
.star-display { color: #d6d7e0; font-size: 1.25rem; line-height: 1.15; }
.rating-hint { margin-left: 6px; color: #838493; font-size: 0.75rem; white-space: nowrap; }
.is-readonly { gap: 1px; }
</style>
