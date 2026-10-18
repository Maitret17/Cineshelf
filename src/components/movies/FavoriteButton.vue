<script setup>
defineProps({
  favorite: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['toggle'])
</script>

<template>
  <button
    class="favorite-button"
    :class="{ 'is-favorite': favorite }"
    type="button"
    :disabled="disabled"
    :aria-pressed="favorite"
    :aria-label="favorite ? 'Remove from favorites' : 'Add to favorites'"
    @click="$emit('toggle')"
  >
    <span class="star" aria-hidden="true">{{ favorite ? '★' : '☆' }}</span>
    <span>{{ favorite ? 'Favorited' : 'Favorite' }}</span>
  </button>
</template>

<style scoped>
.favorite-button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #e5e5ed;
  border-radius: 0px;
  background: #fff;
  padding: 7px 11px;
  color: #626372;
  font-size: 0.82rem;
  font-weight: 700;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}

.favorite-button:hover { border-color: #e7b1c7; background: #fff6fa; color: #b94175; }
.favorite-button.is-favorite { border-color: #f5d5e2; background: #fff0f6; color: #b94175; }
.star { font-size: 1.05rem; line-height: 1; }
</style>
