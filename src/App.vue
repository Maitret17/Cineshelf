
<template>
  <nav>
    <RouterLink to="/">Search</RouterLink>
    |
    <RouterLink to="/library">My Library</RouterLink>
    |
    <RouterLink to="/favorites">Favorites</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>
</template>
