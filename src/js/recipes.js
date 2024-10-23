// Obtener la categoría seleccionada de la URL
const params = new URLSearchParams(window.location.search);
const category = params.get('category');

// Llamar a la API para obtener las recetas por categoría
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        displayRecipes(data.meals);  // Llamar a la función para mostrar las recetas
    })
    .catch(error => console.error('Error al cargar las recetas:', error));

// Función para mostrar las recetas en el contenedor de la cuadrícula
// Función para mostrar las recetas en la cuadrícula
function displayRecipes(recipes) {
    const recipeGrid = document.querySelector('.recipe-grid'); // Usamos la clase recipe-grid
    recipeGrid.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas recetas

    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="recipe-item">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <a href="recipe-details.html?id=${recipe.idMeal}">Ver receta</a>
            </div>
        `;
        recipeGrid.innerHTML += recipeCard;
    });
}
