let currentSlide = 0; // Para controlar el índice del slide actual

// Función para obtener recetas de una categoría específica
function fetchRecipesByCategory(category) {
    const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    return fetch(apiURL)
        .then(response => response.json())
        .then(data => data.meals)
        .catch(error => {
            console.error(`Error al obtener recetas de la categoría ${category}:`, error);
            return []; // Devuelve un array vacío si hay un error
        });
}

// Llamar a la API para múltiples categorías y combinarlas
Promise.all([
    fetchRecipesByCategory('Chicken'),
    fetchRecipesByCategory('Beef'),
    fetchRecipesByCategory('Seafood'),
    fetchRecipesByCategory('Vegetarian'),
    fetchRecipesByCategory('Pasta')
])
    .then(allRecipes => {
        const combinedRecipes = [].concat(...allRecipes); // Combina todas las recetas
        const randomRecipes = getRandomRecipes(combinedRecipes, 10); // Obtener 10 recetas aleatorias
        displayRandomRecipes(randomRecipes);
    })
    .catch(error => console.error('Error al combinar recetas:', error));

// Función para seleccionar aleatoriamente 10 recetas
function getRandomRecipes(recipes, num) {
    // Asegurarse de que haya al menos 'num' recetas antes de intentar seleccionarlas
    if (recipes.length <= num) {
        return recipes; // Si hay menos de 'num' recetas, mostrar todas
    }
    return recipes.sort(() => 0.5 - Math.random()).slice(0, num);
}

// Función para mostrar las recetas aleatorias en una cuadrícula
function displayRandomRecipes(recipes) {
    const randomGridContainer = document.getElementById('random-grid'); // Cambiamos 'carousel' a 'random-grid'
    randomGridContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas recetas

    if (recipes.length === 0) {
        randomGridContainer.innerHTML = '<p>No se encontraron recetas.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="recipe-card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
            </div>
        `;
        randomGridContainer.innerHTML += recipeCard; // Insertar la receta en el contenedor
    });
}
