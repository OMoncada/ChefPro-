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
    const randomGridContainer = document.getElementById('random-grid');
    randomGridContainer.innerHTML = '';

    if (recipes.length === 0) {
        randomGridContainer.innerHTML = '<p>No se encontraron recetas.</p>';
        return;
    }

    recipes.forEach(recipe => {
        fetchMainIngredient(recipe.idMeal).then(ingredient => {
            const recipeCard = `
                <div class="recipe-card">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <h3>${recipe.strMeal}</h3>
                    <div class="tooltip">
                        <p>Ingrediente principal: ${ingredient}</p>
                        <p>Busca más detalles en nuestro catálogo</p>
                    </div>
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
            tooltip.style.display = 'block';
        }
    });

    randomGridContainer.addEventListener('mouseout', (event) => {
        if (event.target.closest('.recipe-card')) {
            const card = event.target.closest('.recipe-card');
            const tooltip = card.querySelector('.tooltip');
            tooltip.style.display = 'none';
        }
    });
}

// Selección de elementos del DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

// Alternar el menú desplegable al hacer clic en el botón de hamburguesa
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    hamburger.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    // Código para el modal de confirmación del formulario
    const modal = document.getElementById('confirmationModal');
    const closeModalButton = document.querySelector('.close');

    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault();
        modal.style.display = 'block';
        event.target.reset();
    });

    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Código para el modal de bienvenida
    const welcomeModal = document.getElementById('welcomeModal');
    const closeWelcomeButton = document.querySelector('.close-welcome');
    const contactButton = document.getElementById('contactButton');

    // Mostrar el modal de bienvenida cuando se carga la página
    welcomeModal.style.display = 'block';

    // Cerrar el modal de bienvenida al hacer clic en la "X"
    closeWelcomeButton.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
    });

    // Cerrar el modal de bienvenida si el usuario hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target === welcomeModal) {
            welcomeModal.style.display = 'none';
        }
    });

    // Redirigir al usuario a la página de contacto al hacer clic en el botón de contacto
    contactButton.addEventListener('click', () => {
        window.location.href = '/src/contact/contact.html';
    });
});
