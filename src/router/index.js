import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LibraryView from "../views/LibraryView.vue";
import FavoritesView from "../views/FavoritesView.vue";
import MovieDetailsView from "../views/MovieDetailsView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/library", component: LibraryView },
    { path: "/favorites", component: FavoritesView },
    { path: "/movie/:id", component: MovieDetailsView }
  ]
});
