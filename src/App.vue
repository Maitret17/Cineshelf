<script setup>
import AppHeader from './components/layout/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="page-container">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>Guillaume - Thomas</p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: #20212a;
  background: #f6f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  --color-primary: #6558d3;
  --color-primary-dark: #5144bc;
  --color-ink: #20212a;
  --color-muted: #737585;
  --color-border: #e6e7ef;
  --color-surface: #ffffff;
  --color-background: #f6f7fb;
  --color-danger: #b9384a;
  --shadow-card: 0 10px 30px rgba(33, 34, 54, 0.06);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

a {
  color: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.page-container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 38px 0 60px;
  flex: 1;
}

.page-heading {
  margin: 0 0 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 2.7rem);
  letter-spacing: -0.045em;
  line-height: 1.15;
}

.page-subtitle {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.65;
}

.section-heading {
  margin: 30px 0 16px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
}

.app-footer {
  border-top: 1px solid var(--color-border);
  padding: 20px;
  color: var(--color-muted);
  font-size: 0.85rem;
  text-align: center;
}

.app-footer p {
  margin: 0;
}

@media (max-width: 640px) {
  .page-container {
    width: min(100% - 28px, 1180px);
    padding-top: 26px;
  }
}
</style>
