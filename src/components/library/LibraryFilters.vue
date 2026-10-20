<script setup>
const props = defineProps({
  searchQuery: { type: String, default: '' },
  status: { type: String, default: 'all' },
  sortBy: { type: String, default: 'recent' }
})

const emit = defineEmits([
  'update:searchQuery',
  'update:status',
  'update:sortBy',
  'clear'
])

function clearFilters() {
  emit('update:searchQuery', '')
  emit('update:status', 'all')
  emit('update:sortBy', 'recent')
  emit('clear')
}
</script>

<template>
  <section class="filters-panel" aria-label="Filter your library">
    <div class="search-field">
      <label for="library-query">Find in your library</label>
      <div class="input-wrap">
        <span aria-hidden="true">⌕</span>
        <input
          id="library-query"
          :value="props.searchQuery"
          type="search"
          placeholder="Movie title or director"
          @input="emit('update:searchQuery', $event.target.value)"
        />
      </div>
    </div>

    <div class="select-field">
      <label for="library-status">Show</label>
      <select
        id="library-status"
        :value="props.status"
        @change="emit('update:status', $event.target.value)"
      >
        <option value="all">All movies</option>
        <option value="unwatched">To watch</option>
        <option value="watched">Watched</option>
        <option value="favorites">Favorites</option>
        <option value="rated">Rated by me</option>
      </select>
    </div>

    <div class="select-field">
      <label for="library-sort">Sort by</label>
      <select
        id="library-sort"
        :value="props.sortBy"
        @change="emit('update:sortBy', $event.target.value)"
      >
        <option value="recent">Recently added</option>
        <option value="title">Title (A–Z)</option>
        <option value="year">Release year</option>
        <option value="rating">My rating</option>
      </select>
    </div>

    <button class="clear-button" type="button" @click="clearFilters">
      Clear filters
    </button>
  </section>
</template>

<style scoped>
.filters-panel {
  display: grid;
  grid-template-columns: minmax(230px, 1.5fr) minmax(140px, 0.8fr) minmax(150px, 0.9fr) auto;
  align-items: end;
  gap: 14px;
  border: 1px solid #e8e9f1;
  border-radius: 0px;
  background: white;
  padding: 18px;
}

.search-field,
.select-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
}

label {
  color: #555665;
  font-size: 0.8rem;
  font-weight: 700;
}

.input-wrap {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  border: 1px solid #e1e2eb;
  border-radius: 0px;
  padding: 0 11px;
  color: #858696;
}

.input-wrap:focus-within,
select:focus {
  border-color: #887ee2;
  outline: 3px solid rgba(101, 88, 211, 0.12);
}

.input-wrap span {
  font-size: 1.45rem;
  line-height: 1;
}

input,
select {
  width: 100%;
  min-width: 0;
  height: 42px;
  border: 1px solid #e1e2eb;
  border-radius: 0px;
  background: white;
  color: #292a35;
  font-size: 0.9rem;
}

.input-wrap input {
  height: 40px;
  border: 0;
  outline: 0;
  padding: 0;
}

input::placeholder { color: #a1a2af; }
select { padding: 0 10px; }

.clear-button {
  height: 42px;
  border: 0;
  border-radius: 0px;
  background: #f2f1ff;
  padding: 0 13px;
  color: #5d50c7;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}

.clear-button:hover { background: #e8e5ff; }

@media (max-width: 850px) {
  .filters-panel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .search-field { grid-column: 1 / -1; }
  .clear-button { justify-self: start; }
}

@media (max-width: 480px) {
  .filters-panel { grid-template-columns: 1fr; padding: 14px; }
  .search-field { grid-column: auto; }
}
</style>
