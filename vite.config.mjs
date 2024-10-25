import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: "src/", // Carpeta raíz del proyecto
    build: {
        outDir: "../dist", // Carpeta de salida para la compilación final
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                recipes: resolve(__dirname, "src/recipes/recipes.html"),
                recipeDetails: resolve(__dirname, "src/recipes/recipe-details.html"),
                myList: resolve(__dirname, "src/list/my-list.html"),
                contact: resolve(__dirname, "src/contact/contact.html"),
                featuredRecipes: resolve(__dirname, "src/recipes/featured_recipes.html"),
            },
        },
    },
});
