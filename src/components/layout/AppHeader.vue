<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="CineShelf home">
        <span>Cine<span class="brand-accent">Shelf</span></span>
      </RouterLink>

      <nav class="main-nav" aria-label="Main navigation">
        <RouterLink to="/" exact-active-class="is-active">Search</RouterLink>
        <RouterLink to="/library" active-class="is-active">My Library</RouterLink>
        <RouterLink to="/favorites" active-class="is-active">Favorites</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid #e9eaf2;
  backdrop-filter: blur(12px);
}

.header-inner {
  display: flex;
  width: min(1180px, calc(100% - 40px));
  min-height: 76px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #20212a;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.055em;
  text-decoration: none;
  white-space: nowrap;
}
.brand-accent {
  color: #6558d3;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 7px;
}

.main-nav a {
  border-radius: 0px;
  padding: 10px 14px;
  color: #737585;
  font-size: 0.94rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 140ms ease, background 140ms ease;
}

.main-nav a:hover {
  background: #f3f2ff;
  color: #5144bc;
}

.main-nav a.is-active {
  background: #efedff;
  color: #5144bc;
}

@media (max-width: 600px) {
  .header-inner {
    width: calc(100% - 28px);
    min-height: auto;
    padding: 15px 0 12px;
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .main-nav {
    width: 100%;
    gap: 4px;
  }

  .main-nav a {
    padding: 9px 10px;
    font-size: 0.88rem;
  }
}
</style>
