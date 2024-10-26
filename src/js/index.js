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

// Función para obtener el ingrediente principal de una receta específica
function fetchMainIngredient(recipeId) {
    const recipeDetailURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;
    return fetch(recipeDetailURL)
        .then(response => response.json())
        .then(data => {
            const recipe = data.meals[0];
            // Devolvemos el primer ingrediente que no sea nulo
            const ingredient = recipe.strIngredient1 || 'Ingrediente principal no disponible';
            return ingredient;
        })
        .catch(error => {
            console.error(`Error al obtener el ingrediente principal para la receta ${recipeId}:`, error);
            return 'Ingrediente principal no disponible'; // Devuelve un mensaje si no se puede obtener
        });
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
        // Aquí obtenemos el ingrediente principal de cada receta
        fetchMainIngredient(recipe.idMeal).then(ingredient => {
            const recipeCard = `
                <div class="recipe-card">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <h3>${recipe.strMeal}</h3>
                    <div class="tooltip">
                        <p>Ingrediente principal: ${ingredient}</p>
                        <p>Busca más detalles en nuestro catalogo</p>
                    </div> <!-- Tooltip que aparecerá al pasar el mouse -->
                </div>
            `;
            randomGridContainer.innerHTML += recipeCard;
        });
    });

    // Agregar el evento de hover para mostrar el tooltip
    randomGridContainer.addEventListener('mouseover', (event) => {
        if (event.target.closest('.recipe-card')) {
            const card = event.target.closest('.recipe-card');
            const tooltip = card.querySelector('.tooltip');
            tooltip.style.display = 'block'; // Mostrar el tooltip al hacer hover
        }
    });

    randomGridContainer.addEventListener('mouseout', (event) => {
        if (event.target.closest('.recipe-card')) {
            const card = event.target.closest('.recipe-card');
            const tooltip = card.querySelector('.tooltip');
            tooltip.style.display = 'none'; // Ocultar el tooltip cuando se quita el hover
        }
    });
}
