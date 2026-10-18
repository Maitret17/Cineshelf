<script setup>
defineProps({
  watched: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['toggle'])
</script>

<template>
  <label class="watched-toggle" :class="{ 'is-watched': watched }">
    <input
      type="checkbox"
      :checked="watched"
      :disabled="disabled"
      @change="$emit('toggle')"
    />
    <span class="custom-check" aria-hidden="true">{{ watched ? '✓' : '' }}</span>
    <span>{{ watched ? 'Watched' : 'Mark as watched' }}</span>
  </label>
</template>

<style scoped>
.watched-toggle {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 8px;
  color: #646575;
  font-size: 0.82rem;
  cursor: pointer;
  user-select: none;
}

.watched-toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

.custom-check {
  display: grid;
  width: 19px;
  height: 19px;
  flex: 0 0 19px;
  place-items: center;
  border: 1.5px solid #ccceda;
  border-radius:0px;
  background: #fff;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
}

.is-watched { color: #23835c; }
.is-watched .custom-check { border-color: #29966a; background: #29966a; }
.watched-toggle input:focus-visible + .custom-check { outline: 3px solid rgba(101, 88, 211, 0.2); }
</style>
