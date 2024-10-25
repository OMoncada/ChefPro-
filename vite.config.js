import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: "./dist", // Ajusta esto si quieres que el build esté en otra carpeta
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"), // Cambiado a la raíz del proyecto
                recipes: resolve(__dirname, "src/recipes/recipes.html"),
                recipeDetails: resolve(__dirname, "src/recipes/recipe-details.html"),
                myList: resolve(__dirname, "src/list/my-list.html"),
                contact: resolve(__dirname, "src/contact/contact.html"),
                featuredRecipes: resolve(__dirname, "src/recipes/featured_recipes.html"),
            },
        },
    },
});
