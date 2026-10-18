<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      watched: 0,
      remaining: 0,
      favorites: 0,
      averageRating: 0
    })
  }
})

const cards = computed(() => [
  { label: 'Movies collected', value: props.stats.total ?? 0, icon: '▤', tone: 'purple' },
  { label: 'Watched', value: props.stats.watched ?? 0, icon: '✓', tone: 'green' },
  { label: 'To watch', value: props.stats.remaining ?? 0, icon: '◷', tone: 'orange' },
  { label: 'Favorites', value: props.stats.favorites ?? 0, icon: '★', tone: 'pink' },
  {
    label: 'Average rating',
    value: `${Number(props.stats.averageRating ?? 0).toFixed(1)} / 5`,
    icon: '★',
    tone: 'yellow'
  }
])
</script>

<template>
  <section class="stats-grid" aria-label="Library statistics">
    <article v-for="card in cards" :key="card.label" class="stat-card">
      <span class="stat-icon" :class="`tone-${card.tone}`" aria-hidden="true">
        {{ card.icon }}
      </span>
      <div>
        <p class="stat-value">{{ card.value }}</p>
        <p class="stat-label">{{ card.label }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin: 28px 0;
}

.stat-card {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  border: 1px solid #e9eaf2;
  border-radius: 0px;
  background: #fff;
  padding: 18px 16px;
  box-shadow: 0 5px 18px rgba(33, 34, 54, 0.03);
}

.stat-icon {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border-radius: 0px;
  font-size: 1.15rem;
  font-weight: 700;
}

.tone-purple { background: #efedff; color: #6558d3; }
.tone-green { background: #e6f8ef; color: #21845b; }
.tone-orange { background: #fff0df; color: #b86a13; }
.tone-pink { background: #ffe8f0; color: #bd4775; }
.tone-yellow { background: #fff7d8; color: #9d7918; }

.stat-value {
  margin: 0 0 3px;
  color: #20212a;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  margin: 0;
  color: #737585;
  font-size: 0.78rem;
  line-height: 1.35;
}

@media (max-width: 1000px) {
  .stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 620px) {
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .stat-card { padding: 14px 12px; gap: 9px; }
  .stat-icon { width: 34px; height: 34px; flex-basis: 34px; }
  .stat-value { font-size: 1.15rem; }
  .stat-label { font-size: 0.73rem; }
}
</style>
