// Obtener el parámetro de categoría desde la URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

// URL de la API para obtener recetas por categoría
const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

// Llamar a la API para obtener las recetas de la categoría seleccionada
fetch(apiURL)
    .then(response => response.json())
    .then(data => displayRecipes(data.meals))
    .catch(error => console.error('Error al obtener las recetas:', error));

// Función para mostrar las recetas
function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas recetas

    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="recipe-card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <a href="recipe-details.html?id=${recipe.idMeal}">Ver receta</a>
            </div>
        `;
        recipeContainer.innerHTML += recipeCard;
    });
}
